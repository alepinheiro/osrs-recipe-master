import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useRecipeStores = defineStore(
  "recipes",
  () => {
    const recipes = ref<Map<string, Recipe>>(new Map());
    // Histórico das duas últimas margens de cada receita
    const recipeMarginsHistory = ref<Map<string, [number, number]>>(new Map());

    /**
     * Calcula a margem de uma receita
     */
    function calculateMargin(recipe: Recipe): number {
      const cost = Object.values(recipe.inputs).reduce(
        (acc: number, item: RecipeItem) =>
          acc + (item.buyPrice ?? 0) * (item.quantity ?? 0),
        0,
      );
      const revenue = recipe.highAlchMode
        ? Object.values(recipe.outputs).reduce(
            (acc: number, item: RecipeItem) =>
              acc + (item.highAlch ?? 0) * (item.quantity ?? 0),
            0,
          )
        : Object.values(recipe.outputs).reduce(
            (acc: number, item: RecipeItem) =>
              acc + (item.sellPrice ?? 0) * (item.quantity ?? 0),
            0,
          );
      const profit = revenue - cost;
      return cost > 0 ? (profit / cost) * 100 : 0;
    }

    /**
     * Atualiza o histórico de margens de uma receita
     */
    function updateRecipeMarginHistory(recipeId: string, margin: number) {
      const prev = recipeMarginsHistory.value.get(recipeId);
      if (prev) {
        recipeMarginsHistory.value.set(recipeId, [prev[1], margin]);
      } else {
        recipeMarginsHistory.value.set(recipeId, [margin, margin]);
      }
    }

    /**
     * Retorna a tendência da margem: "up", "down" ou "stable"
     */
    function getRecipeMarginTrend(recipeId: string): "up" | "down" | "stable" {
      const history = recipeMarginsHistory.value.get(recipeId);
      if (!history) return "stable";
      if (history[1] > history[0]) return "up";
      if (history[1] < history[0]) return "down";
      return "stable";
    }

    function addRecipe(recipe: Recipe) {
      // Se não vier updatedAt, define como data atual
      const now = new Date().toISOString();
      recipes.value.set(recipe.id, {
        ...recipe,
        updatedAt: recipe.updatedAt || now,
        autoUpdatePrices: recipe.autoUpdatePrices ?? false,
      });
      // Inicializa histórico de margem
      const margin = calculateMargin(recipe);
      updateRecipeMarginHistory(recipe.id, margin);
    }

    function getRecipe(id: string): Recipe | undefined {
      return recipes.value.get(id);
    }

    function updateRecipe(id: string, updated: Partial<Recipe>) {
      const recipe = recipes.value.get(id);
      if (recipe) {
        // Verifica se algum campo relevante mudou
        const fieldsToCheck: (keyof Recipe)[] = [
          "inputs",
          "outputs",
          "highAlchMode",
          "autoUpdatePrices",
          "name",
        ];
        let changed = false;
        for (const key of fieldsToCheck) {
          if (
            key in updated &&
            JSON.stringify(updated[key]) !== JSON.stringify(recipe[key])
          ) {
            changed = true;
            break;
          }
        }
        recipes.value.set(id, {
          ...recipe,
          ...updated,
          updatedAt: changed ? new Date().toISOString() : recipe.updatedAt,
        });
        // Atualiza histórico de margem se inputs/outputs mudaram
        const newRecipe = recipes.value.get(id);
        if (newRecipe) {
          const margin = calculateMargin(newRecipe);
          updateRecipeMarginHistory(id, margin);
        }
      }
    }

    function deleteRecipe(id: string) {
      recipes.value.delete(id);
      recipeMarginsHistory.value.delete(id);
    }

    function getAllRecipes(): Recipe[] {
      return Array.from(recipes.value.values());
    }

    return {
      recipes,
      recipeMarginsHistory,
      addRecipe,
      getRecipe,
      updateRecipe,
      deleteRecipe,
      getAllRecipes,
      calculateMargin,
      updateRecipeMarginHistory,
      getRecipeMarginTrend,
    };
  },
  {
    persist: true,
  },
);
