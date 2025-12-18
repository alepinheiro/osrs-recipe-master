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

definePageMeta({
  title: "OSRS Recipe Master — Todas as Receitas",
  meta: [
    {
      name: "description",
      content:
        "Veja, crie e gerencie receitas de itens do Old School RuneScape.",
    },
    { property: "og:title", content: "OSRS Recipe Master — Todas as Receitas" },
    {
      property: "og:description",
      content:
        "Veja, crie e gerencie receitas de itens do Old School RuneScape.",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/og-image.png" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "OSRS Recipe Master — Todas as Receitas",
    },
    {
      name: "twitter:description",
      content:
        "Veja, crie e gerencie receitas de itens do Old School RuneScape.",
    },
    { name: "twitter:image", content: "/og-image.png" },
  ],
});

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

const recipes = computed(() => recipesStore.getAllRecipes());

// Intervalo de atualização em segundos (default: 60)
const priceUpdateInterval = ref<number>(60);

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

  for (const [itemId, recipesToUpdate] of itemIdsMap) {
    if (!data[itemId]) continue;

    // Atualiza o preço do item no store global
    itemsStore.updateItem({
      id: itemId,
      gePrices: data[itemId],
    });

    for (const recipeId of recipesToUpdate) {
      const recipe = recipesStore.getRecipe(recipeId);
      if (!recipe) continue;

      let shouldNotify = false;
      let notificationMsgs: string[] = [];

      const dataMap = (
        inputs: Recipe["inputs"],
        itemId: string,
        prices: Record<string, { high: number; low: number }>,
      ) =>
        inputs.map((input) => {
          if (input.id === itemId && prices[itemId]) {
            const oldPrice = input.buyPrice || 0;
            const newPrice = prices[itemId].low;
            if (newPrice !== oldPrice) {
              shouldNotify = true;
              const icon = newPrice > oldPrice ? "⬆️" : "⬇️";
              notificationMsgs.push(
                `${icon} '${input.name}' | '${recipe.name}' alterado de ` +
                  ` ${oldPrice.toLocaleString()} ${icon} ${newPrice.toLocaleString()} ${icon}`,
              );
            }
            return {
              ...input,
              buyPrice: newPrice,
              sellPrice: prices[itemId].high,
            };
          }
          return { ...input };
        });

      // Cria cópia profunda para garantir reatividade
      const updatedRecipe = {
        ...recipe,
        inputs: dataMap(recipe.inputs, itemId, data),
        outputs: dataMap(recipe.outputs, itemId, data),
      };

      recipesStore.updateRecipe(recipeId, updatedRecipe);
      if (shouldNotify && notificationMsgs.length > 0) {
        notificationMsgs.forEach((msg) => toast.info(msg));
      }
    }
  }
};

// Usa useIntervalFn do @vueuse/core para disparar a cada priceUpdateInterval
useIntervalFn(
  updateRecipePrices,
  computed(() => priceUpdateInterval.value * 1000),
);
</script>
