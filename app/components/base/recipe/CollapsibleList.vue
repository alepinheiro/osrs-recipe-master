<template>
  <Collapsible>
    <CollapsibleTrigger
      class="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground w-full"
    >
      <ChevronRight
        class="h-4 w-4 transition-transform data-[state=open]:rotate-90"
      />
      <component :is="icon" class="h-4 w-4 text-amber-500" />
      <span>{{ title }} ({{ items.length }}) </span>
      <span v-if="items[0]?.buyPrice !== undefined" title="Instabuy">
        <ShoppingCart class="inline h-3 w-3 text-blue-500" />
        {{ formatGP(getCost("buyPrice")) }} gp
      </span>
      <span title="Instasell" class="ml-1">
        <Coins class="inline h-3 w-3 text-amber-500" />
        {{ formatGP(getCost("sellPrice")) }} gp
      </span>
      <span title="High Alch" class="ml-1">
        <Sparkles class="inline h-3 w-3 text-amber-500" />
        {{ formatGP(getCost("highAlch")) }} gp
      </span>
    </CollapsibleTrigger>
    <CollapsibleContent class="pl-6 pt-2 space-y-1">
      <ul>
        <RecipeListItem
          v-for="item in items"
          :key="item.buyPrice + item.sellPrice"
          :item="item"
        />
      </ul>
    </CollapsibleContent>
  </Collapsible>
</template>

<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, Coins, ShoppingCart, Sparkles } from "lucide-vue-next";
import RecipeListItem from "~/components/base/recipe/RecipeListItem.vue";

const props = defineProps<{
  title: string;
  icon: any;
  items: Recipe["inputs"];
}>();

const recipeCost = computed(() =>
  props.items.reduce(
    (acc, item) => acc + (item.buyPrice ?? 0) * (item.quantity ?? 0),
    0,
  ),
);

const getCost = (key: keyof RecipeItem) => {
  return props.items.reduce(
    (acc, item) => acc + Number(item[key] ?? 0) * (item.quantity ?? 0),
    0,
  );
};

const formatGP = (value: number) => {
  return value.toLocaleString();
};
</script>
