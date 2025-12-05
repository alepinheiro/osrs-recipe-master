<template>
  <li class="text-sm text-muted-foreground">
    <div class="flex gap-2">
      <img
        :alt="itemData(item.id)?.name"
        :title="itemData(item.id)?.name"
        class="brightness-150 contrast-125 dark:brightness-125 scale-110 object-contain"
        :src="`https://oldschool.runescape.wiki/images/${itemData(item.id)?.icon.replaceAll(' ', '_')}?cache`"
      />
      <div class="flex flex-col">
        <p>
          {{ item.quantity }}x
          {{ item.name || "Item não selecionado" }}
        </p>
        <span
          v-if="
            item.buyPrice !== undefined ||
            item.sellPrice !== undefined ||
            item.highAlch !== undefined
          "
          class="ml-2 flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span v-if="item.buyPrice !== undefined" title="Instabuy">
            <ShoppingCart class="inline h-3 w-3 text-blue-500" />
            {{ formatGP(item.buyPrice) }} gp
          </span>
          <span
            v-if="item.sellPrice !== undefined"
            title="Instasell"
            class="ml-1"
          >
            <Coins class="inline h-3 w-3 text-amber-500" />
            {{ formatGP(item.sellPrice) }} gp
          </span>
          <span
            v-if="item.highAlch !== undefined"
            title="High Alch"
            class="ml-1"
          >
            <Sparkles class="inline h-3 w-3 text-amber-500" />
            {{ formatGP(item.highAlch) }} gp
          </span>
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ShoppingCart, Coins, Sparkles } from "lucide-vue-next";

defineProps<{
  item: RecipeItem;
}>();
const itemStore = useItemsStore();

const itemData = (id: string) => {
  const data = itemStore.itemsMap.get(id);
  if (!data) return null;
  return data;
};

const formatGP = (value: number) => {
  return value.toLocaleString();
};
</script>
