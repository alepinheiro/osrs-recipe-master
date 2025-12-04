import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useRecipeStores = defineStore("recipes", () => {
  const recipes = ref<Map<string, Recipe>>(new Map());

  function addRecipe(recipe: Recipe) {
    recipes.value.set(recipe.id, recipe);
  }

  function getRecipe(id: string): Recipe | undefined {
    return recipes.value.get(id);
  }

  function updateRecipe(id: string, updated: Partial<Recipe>) {
    const recipe = recipes.value.get(id);
    if (recipe) {
      recipes.value.set(id, { ...recipe, ...updated });
    }
  }

  function deleteRecipe(id: string) {
    recipes.value.delete(id);
  }

  function getAllRecipes(): Recipe[] {
    return Array.from(recipes.value.values());
  }

  return {
    recipes,
    addRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
  };
});
