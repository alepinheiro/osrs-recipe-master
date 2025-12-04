<template>
  <div class="py-2 flex flex-col gap-4 max-w-5xl mx-auto">
    <Card class="px-6 h-24 items-center justify-between flex-row">
      <h1>⚔️ OSRS Recipe Master</h1>
      <div class="bg-zinc-300 rounded-2xl h-full w-48"></div>
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

    <div>
      <template v-if="recipes.length === 0">
        <div
          class="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2 bg-zinc-100 rounded border-zinc-300 border-dashed border-2"
        >
          <span class="text-2xl">Nenhuma receita cadastrada</span>
          <span class="text-sm">
            Clique em <b>Adicionar receita</b> para criar sua primeira receita.
          </span>
        </div>
      </template>
      <template v-else>
        <BaseRecipeCard
          v-for="recipe of recipes"
          :key="recipe.id"
          :modelValue="recipe"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecipeStores } from "~/stores/useRecipesStore";

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
});
const recipes = computed(() => Array.from(recipesStore.recipes.values()));

await useFetch<Array<Item>>(
  () => `https://prices.runescape.wiki/api/v1/osrs/mapping`,
  {
    onResponse({ response }) {
      const data = response._data as Array<Item>;
      itemsStore.updateItems(data);
    },
  },
);
</script>
