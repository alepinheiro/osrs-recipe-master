<template>
  <div>
    <div>
      <BaseRecipeItemsGroup v-model="unfinishedRecipe.inputs">
        <template #header>
          <p class="font-semibold text-lg">Inputs:</p>
        </template>
        <template #footer>
          <div class="flex flex-col text-sm text-right">
            <p>
              Preço (Insta Buy):
              <b> {{ instaBuyCost.toLocaleString() }} gp </b>
            </p>
            <p>
              Preço (Slow Buy):
              <b> {{ slowBuyCost.toLocaleString() }} gp </b>
            </p>
          </div>
        </template>
      </BaseRecipeItemsGroup>

      <Separator class="my-4" />

      <BaseRecipeItemsGroup v-model="unfinishedRecipe.outputs">
        <template #header>
          <p class="font-semibold text-lg">Outputs:</p>
          <div
            v-if="unfinishedRecipe.highAlchMode"
            class="bg-yellow-100 border border-yellow-400 rounded"
          >
            <p class="text-sm px-2 py-1 text-yellow-900">
              Modo High Alch ativado! Lembre se de adicionar a Nature rune aos
              inputs.
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-col text-sm text-right">
            <template v-if="unfinishedRecipe.highAlchMode">
              <p>
                Receita esperada:
                <b>
                  {{ estimatedProfit.toLocaleString() }}
                  gp
                </b>
              </p>
            </template>
            <template v-else>
              <p>
                Preço (Insta Sell):
                <b> {{ instaSellProfit.toLocaleString() }} gp </b>
              </p>
              <p>
                Preço (Slow Sell):
                <b> {{ slowSellProfit.toLocaleString() }} gp </b>
              </p>
            </template>
          </div>
        </template>
      </BaseRecipeItemsGroup>
    </div>

    <Separator class="my-4" />

    <div class="flex flex-col w-full gap-4">
      <div class="flex gap-2 ml-auto items-center">
        <Label> Usar High Alch </Label>
        <Switch v-model="unfinishedRecipe.highAlchMode" />
      </div>

      <div class="flex gap-2 w-full">
        <Input placeholder="Nome da receita" v-model="unfinishedRecipe.name" />
        <Button class="ml-auto" @click="onSaveRecipe"> Salvar Receita </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecipeSchema } from "~~/shared/types/Recipe.schema";
import { toast } from "vue-sonner";
const emit = defineEmits(["saved"]);

const recipeStore = useRecipeStores();
const unfinishedRecipe = defineModel<Recipe>({
  required: true,
});

const instaBuyCost = computed(() => {
  return unfinishedRecipe.value.inputs.reduce((total, input) => {
    return total + input.buyPrice * input.quantity;
  }, 0);
});

const slowBuyCost = computed(() => {
  return unfinishedRecipe.value.inputs.reduce((total, input) => {
    return total + input.sellPrice * input.quantity;
  }, 0);
});

const instaSellProfit = computed(() => {
  return unfinishedRecipe.value.outputs.reduce((total, input) => {
    return total + input.buyPrice * input.quantity;
  }, 0);
});

const slowSellProfit = computed(() => {
  return unfinishedRecipe.value.outputs.reduce((total, input) => {
    return total + input.sellPrice * input.quantity;
  }, 0);
});

const estimatedProfit = computed(() => {
  const outputValue = unfinishedRecipe.value.outputs.reduce((total, output) => {
    const price = unfinishedRecipe.value.highAlchMode
      ? output.highAlch || 0
      : output.sellPrice;
    return total + price * output.quantity;
  }, 0);
  return outputValue;
});

const onSaveRecipe = () => {
  unfinishedRecipe.value.savedAt = new Date().toISOString();
  unfinishedRecipe.value.updatedAt = new Date().toISOString();
  const result = RecipeSchema.safeParse(unfinishedRecipe.value);
  if (result.error) {
    console.error("Erro de validação da receita:", result.error);
    for (const issue of result.error.issues) {
      toast.error(`${issue.message}`);
    }
    return;
  }
  recipeStore.addRecipe(result.data);
  toast.success("Receita salva com sucesso!");
  emit("saved");
  unfinishedRecipe.value = {
    name: "",
    tags: [],
    inputs: [],
    outputs: [],
    highAlchMode: false,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    autoUpdatePrices: false,
  };
};
</script>
