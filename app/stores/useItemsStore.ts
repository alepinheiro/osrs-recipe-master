import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useItemsStore = defineStore("items", () => {
  const TAX_ITEM: Item = {
    id: 999999,
    name: "Taxas",
    examine: "Item usado para calcular taxas de mercado.",
    icon: "https://oldschool.runescape.wiki/images/Tax_icon.png?f2f5e",
    highalch: 0,
    limit: 2147483647,
    lowalch: 0,
    members: false,
    slug: "tax-icon",
    value: 1,
    wiki_url: "https://oldschool.runescape.wiki/w/Tax_icon",
  };

  const itemsMap = ref<Map<string | number, Item>>(new Map());

  const updateItems = (newItems: Array<Item>) => {
    const map = new Map<number, Item>();
    itemsMap.value = map;
    newItems.push(TAX_ITEM);
    for (const item of newItems) {
      if (item.id !== 0) map.set(item.id, item);
    }
  };

  const items = computed(() => Array.from(itemsMap.value.values()));

  return { items, itemsMap, updateItems };
});
