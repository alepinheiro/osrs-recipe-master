<template>
  <Card class="overflow-hidden gap-0 hover:shadow-md transition-shadow">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-lg">
            {{ model.name }}
          </CardTitle>

          <p class="text-xs text-muted-foreground">
            Salvo em: {{ formatDate(model.savedAt) }}
          </p>
          <p v-if="model.updatedAt" class="text-xs text-muted-foreground">
            Atualizado em: {{ formatDate(model.updatedAt) }}
          </p>

          <div
            v-if="model.tags.length > 0 || model.highAlchMode"
            class="flex gap-1 flex-wrap mt-1"
          >
            <Badge
              v-for="value in model.tags"
              :key="value"
              variant="secondary"
              class="text-xs"
            >
              {{ value }}
            </Badge>
            <Badge
              v-if="model.highAlchMode"
              class="text-xs bg-amber-500 text-white hover:bg-amber-500"
            >
              HIGH ALCH
            </Badge>
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <Button size="sm" variant="secondary" @click="onDuplicate()">
            <CopyPlus class="h-4 w-4" />
            Duplicar
          </Button>

          <BaseResponsiveModal v-model:open="modalOpen">
            <template #trigger>
              <Button size="sm" variant="secondary">
                <Edit class="h-3 w-3 mr-1" />
                Editar
              </Button>
            </template>
            <template #title>Editar {{ model.name }}</template>
            <template #description>
              Alteres os detalhes e clique em salvar.
            </template>
            <template #body>
              <BaseRecipeForm
                v-model="model"
                class="w-full"
                @saved="modalOpen = false"
              />
            </template>
          </BaseResponsiveModal>

          <Button size="sm" variant="destructive">
            <Trash2 class="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent class="space-y-3">
      <div
        :class="[recipeProfit > 0 ? 'bg-emerald-50' : 'bg-red-50']"
        class="rounded-lg p-3"
      >
        <p class="text-xs text-muted-foreground">Lucro Liquido</p>
        <p
          :class="[recipeProfit > 0 ? 'text-emerald-600' : 'text-red-600']"
          class="text-xl font-bold"
        >
          {{ formatGP(recipeProfit) }} gp
        </p>
        <p class="text-xs text-muted-foreground">
          {{ recipeMargin.toFixed(1) }}% de margem
        </p>
      </div>
      <div class="space-y-2">
        <CollapsibleList
          :title="'Inputs'"
          :icon="Sparkles"
          :items="model.inputs"
        >
        </CollapsibleList>
        <CollapsibleList
          :title="'Outputs'"
          :icon="Package"
          :items="model.outputs"
        >
        </CollapsibleList>
      </div>
    </CardContent>

    <CardFooter>
      <div class="flex items-center gap-1 mr-2">
        <Switch v-model="model.autoUpdatePrices" />
        <span class="text-xs text-muted-foreground">
          Atualizar preços automaticamente
        </span>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Trash2, Package, Sparkles, Edit, CopyPlus } from "lucide-vue-next";
import CollapsibleList from "./recipe/CollapsibleList.vue";
import { useRecipeStores } from "@/stores/useRecipesStore";
import { formatDateLocale } from "@/utils/dateLocale";

const model = defineModel<Recipe>({
  required: true,
});
const modalOpen = ref<boolean>(false);
const recipesStore = useRecipeStores();
const recipeCost = computed(() =>
  model.value.inputs.reduce(
    (acc, item) => acc + (item.buyPrice ?? 0) * (item.quantity ?? 0),
    0,
  ),
);

const recipeRevenue = computed(() =>
  model.value.highAlchMode
    ? model.value.outputs.reduce(
        (acc, item) => acc + (item.highAlch ?? 0) * (item.quantity ?? 0),
        0,
      )
    : model.value.outputs.reduce(
        (acc, item) => acc + (item.sellPrice ?? 0) * (item.quantity ?? 0),
        0,
      ),
);

const recipeProfit = computed(() => recipeRevenue.value - recipeCost.value);
const recipeMargin = computed(() => recipesStore.calculateMargin(model.value));

const formatGP = (value: number) => {
  return value.toLocaleString();
};

const formatDate = (date: string | Date) => {
  if (!date) return "";
  return formatDateLocale(date, "dd MMM yyyy, HH:mm:ss", "pt-BR");
};

const onDuplicate = () => {
  recipesStore.duplicateRecipe(model.value.id);
};
</script>
