import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useItemsStore = defineStore("items", () => {
  const TAX_ITEM: Item = {
    id: `999999`,
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
    gePrices: {
      high: 1,
      highTime: 1,
      low: 1,
      lowTime: 1,
    },
  };

  const itemsMap = ref<Map<string, Item>>(new Map());

  /**
   * Atualiza todos os itens do mapa, garantindo reatividade.
   */
  const updateItems = (newItems: Array<Item>) => {
    newItems.push(TAX_ITEM);
    for (const item of newItems) {
      itemsMap.value.set(`${item.id}`, { ...item, id: `${item.id}` });
    }
  };

  /**
   * Adiciona um item ao mapa, criando novo objeto para garantir reatividade.
   */
  const addItem = (item: Item) => {
    const map = new Map(itemsMap.value);
    map.set(item.id, item);
    itemsMap.value = map;
  };

  /**
   * Remove um item do mapa, criando novo objeto para garantir reatividade.
   */
  const removeItem = (id: string) => {
    const map = new Map(itemsMap.value);
    map.delete(id);
    itemsMap.value = map;
  };

  /**
   * Atualiza um item existente, criando novo objeto para garantir reatividade.
   */
  const updateItem = (partial: Partial<Item>) => {
    const item = itemsMap.value.get(partial.id!);
    if (!item) throw new Error(`Item with id ${partial.id} not found`);
    itemsMap.value.set(partial.id!, {
      ...item,
      ...partial,
      id: `${partial.id}`,
    });
  };

  const items = computed(() => Array.from(itemsMap.value.values()));

  return { items, itemsMap, updateItems, addItem, removeItem, updateItem };
});
