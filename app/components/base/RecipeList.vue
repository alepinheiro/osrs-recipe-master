<template>
  <div>
    <div v-if="!recipes || recipes.length === 0">
      <div
        class="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2 bg-zinc-100 rounded border-zinc-300 border-dashed border-2"
      >
        <span class="text-2xl">Nenhuma receita cadastrada</span>
        <span class="text-sm">
          Clique em <b>Adicionar receita</b> para criar sua primeira receita.
        </span>
      </div>
    </div>
    <div v-else class="flex flex-col gap-2">
      <BaseRecipeCard
        v-for="recipe of recipes"
        :key="recipe.id"
        :modelValue="recipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseRecipeCard from "./RecipeCard.vue";

defineProps<{ recipes: Recipe[] }>();
</script>
