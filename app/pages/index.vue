<template>
  <div class="py-2 flex flex-col gap-4 max-w-5xl mx-auto">
    <Card
      class="px-6 h-24 items-center justify-between flex-row relative overflow-visible"
    >
      <h1>⚔️ OSRS Recipe Master</h1>
      <BasePriceUpdateInterval v-model="priceUpdateInterval">
        <template #progress="{ progress }">
          <div
            class="absolute left-0 -bottom-1 h-1 bg-blue-500 rounded-full transition-all mx-2"
            :style="{ width: progress + '%', transition: 'width 0.2s linear' }"
          />
        </template>
      </BasePriceUpdateInterval>
    </Card>

    <div class="flex gap-4 justify-between items-center">
      <h2>Todas as Receitas</h2>
      <BaseResponsiveModal v-model:open="modalOpen">
        <template #trigger>
          <Button class="w-fit ml-auto"> Adicionar receita </Button>
        </template>
        <template #title>Adicionar Nova Receita</template>
        <template #description>
          Preencha os detalhes da nova receita abaixo.
        </template>
        <template #body>
          <BaseRecipeForm
            v-model="newRecipe"
            class="w-full"
            @saved="modalOpen = false"
          />
        </template>
      </BaseResponsiveModal>
    </div>

    <RecipeList :recipes="recipes" />
  </div>
</template>

<script setup lang="ts">
import RecipeList from "@/components/base/RecipeList.vue";
import { useIntervalFn } from "@vueuse/core";
import { toast } from "vue-sonner";

const modalOpen = ref<boolean>(false);
const recipesStore = useRecipeStores();
const itemsStore = useItemsStore();
const newRecipe = ref<Recipe>({
  name: "",
  tags: [],
  inputs: [],
  outputs: [],
  highAlchMode: false,
  id: crypto.randomUUID(),
  savedAt: new Date().toLocaleString(),
  updatedAt: new Date().toLocaleString(),
  autoUpdatePrices: true,
});

const recipes = computed(() => Array.from(recipesStore.recipes.values()));

// Intervalo de atualização em segundos (default: 60)
const priceUpdateInterval = ref<number>(60);
const MARGIN_CHANGE_THRESHOLD = 0.01; // 0.1% para evitar spam

await useFetch<Array<Item>>(
  () => "https://prices.runescape.wiki/api/v1/osrs/mapping",
  {
    onResponse({ response }) {
      const data = response._data as Array<Item>;
      itemsStore.updateItems(data);
    },
    onResponseError({ response }) {
      console.error("Erro ao carregar items:", response.status);
      toast.error("Falha ao carregar itens do jogo");
    },
  },
);

/**
 * Retorna todos os IDs únicos dos itens das receitas ativas (autoUpdatePrices=true).
 * Ignora itens com itemId inválido (999999 ou falsy).
 * @returns {Map<string, Array<string>>} Mapa de itemId para array de recipeId.
 */
function getAllUniqueItemIdsFromRecipes() {
  const recipeIngredientsMap = new Map<string, Array<string>>();

  recipes.value
    .filter((recipe) => recipe.autoUpdatePrices)
    .forEach((recipe) => {
      [...recipe.inputs, ...recipe.outputs].forEach((item) => {
        if (item.id && item.id !== `999999`) {
          if (!recipeIngredientsMap.has(item.id)) {
            recipeIngredientsMap.set(item.id, []);
          }
          const arr = recipeIngredientsMap.get(item.id)!;
          if (!arr.includes(recipe.id)) {
            arr.push(recipe.id);
          }
        }
      });
    });

  return recipeIngredientsMap;
}

/**
 * Busca todos os preços de itens em lote usando o endpoint oficial do OSRS Wiki.
 * @async
 * @returns {Promise<OsrsItemPriceResponse>} Objeto contendo todos os preços dos itens, indexados por itemId.
 */
async function fetchAllLatestPrices(): Promise<OsrsItemPriceResponse> {
  try {
    const response = await $fetch<OsrsItemPriceResponse>(
      "https://prices.runescape.wiki/api/v1/osrs/latest",
      { cache: "no-cache" },
    );
    return response;
  } catch (err) {
    console.error("Erro ao buscar preços dos itens", err);
    return { data: {} };
  }
}

/**
 * Atualiza os preços dos itens das receitas usando os dados mais recentes do endpoint /latest.
 * Para cada receita, verifica se algum item foi atualizado e recalcula a margem.
 * Se a margem mudou acima do threshold, atualiza o histórico e exibe toast.
 * @async
 * @returns {Promise<void>}
 */

// Função revisada para garantir reatividade e atualização correta dos preços
const updateRecipePrices = async (): Promise<void> => {
  console.info("Iniciando atualização de preços das receitas...");

  const itemIdsMap = getAllUniqueItemIdsFromRecipes();
  const { data } = await fetchAllLatestPrices();
  const notifications: string[] = [];

  for (const [itemId, recipesToUpdate] of itemIdsMap) {
    // Atualiza o preço do item no store global
    if (data[itemId]) {
      itemsStore.updateItem({
        id: itemId,
        gePrices: data[itemId],
      });
    }

    for (const recipeId of recipesToUpdate) {
      const recipe = recipesStore.recipes.get(recipeId);
      if (!recipe) continue;

      // Cria cópia profunda para garantir reatividade
      const updatedRecipe = {
        ...recipe,
        inputs: recipe.inputs.map((input) => {
          if (input.id === itemId && data[itemId]) {
            const oldPrice = input.buyPrice || 0;
            const newPrice = data[itemId].low;
            if (
              Math.abs(newPrice - oldPrice) / (oldPrice || 1) >=
              MARGIN_CHANGE_THRESHOLD
            ) {
              notifications.push(
                `Preço atualizado para ${input.name} na receita ${updatedRecipe.name}`,
              );
            }
            return {
              ...input,
              buyPrice: newPrice,
              sellPrice: data[itemId].high,
            };
          }
          return { ...input };
        }),
        outputs: recipe.outputs.map((output) => {
          if (output.id === itemId && data[itemId]) {
            const oldPrice = output.sellPrice || 0;
            const newPrice = data[itemId].high || data[itemId].low;
            if (
              Math.abs(newPrice - oldPrice) / (oldPrice || 1) >=
              MARGIN_CHANGE_THRESHOLD
            ) {
              notifications.push(
                `Preço atualizado para ${output.name} na receita ${updatedRecipe.name}`,
              );
            }
            return {
              ...output,
              buyPrice: data[itemId].low,
              sellPrice: newPrice,
            };
          }
          return { ...output };
        }),
      };
      recipesStore.updateRecipe(recipeId, updatedRecipe);
    }
  }

  // Exibe notificações agrupadas
  if (notifications.length > 0) {
    notifications.forEach((msg) => toast.success(msg));
  }
};

// Usa useIntervalFn do @vueuse/core para disparar a cada priceUpdateInterval
useIntervalFn(
  updateRecipePrices,
  computed(() => priceUpdateInterval.value * 1000),
);
</script>
