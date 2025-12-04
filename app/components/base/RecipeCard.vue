<template>
  <Card class="overflow-hidden hover:shadow-md transition-shadow">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-base">
            {{ model.name }}
          </CardTitle>
          <p class="text-xs text-muted-foreground">
            Salvo em: {{ model.savedAt }}
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

        <div class="flex gap-2">
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
      <div class="flex gap-8 text-sm">
        <div>
          <p class="text-muted-foreground">Custo (Insta)</p>
          <p class="font-semibold">{{ formatGP(recipeCost) }} gp</p>
        </div>
        <div>
          <p class="text-muted-foreground">Receita</p>
          <p class="font-semibold text-emerald-600">
            {{ formatGP(recipeRevenue) }} gp
          </p>
        </div>
      </div>
      <div class="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
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
        <Collapsible>
          <CollapsibleTrigger
            class="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground w-full"
          >
            <ChevronRight
              class="h-4 w-4 transition-transform data-[state=open]:rotate-90"
            />
            <Sparkles class="h-4 w-4 text-amber-500" />
            Inputs ({{ model.inputs.length }})
          </CollapsibleTrigger>
          <CollapsibleContent class="pl-6 pt-2 space-y-1">
            <ul>
              <li
                v-for="input in model.inputs"
                class="text-sm text-muted-foreground"
              >
                {{ input.quantity }}x
                {{ input.itemName || "Item não selecionado" }}
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <CollapsibleTrigger
            class="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground w-full"
          >
            <ChevronRight
              class="h-4 w-4 transition-transform data-[state=open]:rotate-90"
            />
            <Package class="h-4 w-4 text-amber-500" />
            Outputs ({{ model.outputs.length }})
          </CollapsibleTrigger>
          <CollapsibleContent class="pl-6 pt-2 space-y-1">
            <ul>
              <li
                v-for="output in model.outputs"
                class="text-sm text-muted-foreground"
              >
                {{ output.quantity }}x
                {{ output.itemName || "Item não selecionado" }}
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ChevronRight, Trash2, Package, Sparkles, Edit } from "lucide-vue-next";
const formatGP = (value: number) => {
  return value.toLocaleString("pt-BR");
};

const modalOpen = ref(<boolean>false);

const model = defineModel<Recipe>({
  required: true,
});

const recipeCost = model.value.inputs.reduce(
  (acc, item) => acc + item.buyPrice * item.quantity,
  0,
);

const recipeRevenue = model.value.highAlchMode
  ? model.value.outputs.reduce(
      (acc, item) => acc + (item.highAlch || 0) * item.quantity,
      0,
    )
  : model.value.outputs.reduce(
      (acc, item) => acc + item.sellPrice * item.quantity,
      0,
    );
const recipeProfit = recipeRevenue - recipeCost;
const recipeMargin = recipeCost > 0 ? (recipeProfit / recipeCost) * 100 : 0;
</script>
