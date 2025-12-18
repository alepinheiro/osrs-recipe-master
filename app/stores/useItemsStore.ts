import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useItemsStore = defineStore(
  "items",
  () => {
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

    const itemsArray = ref<Item[]>([]);

    /**
     * Atualiza todos os itens do array, garantindo reatividade.
     */
    const updateItems = (newItems: Array<Item>) => {
      try {
        const items = [...newItems, TAX_ITEM].map((item) => ({
          ...item,
          id: `${item.id}`,
        }));
        itemsArray.value = items;
      } catch (error) {
        console.error("Error updating items:", error);
      }
    };

    /**
     * Adiciona um item ao array, criando novo array para garantir reatividade.
     */
    const addItem = (item: Item) => {
      // Remove se já existir com o mesmo id
      itemsArray.value = [
        ...itemsArray.value.filter((i) => i.id !== item.id),
        { ...item, id: `${item.id}` },
      ];
    };

    /**
     * Remove um item do array, criando novo array para garantir reatividade.
     */
    const removeItem = (id: string) => {
      itemsArray.value = itemsArray.value.filter((item) => item.id !== id);
    };

    /**
     * Atualiza um item existente, criando novo array para garantir reatividade.
     */
    const updateItem = (partial: Partial<Item>) => {
      itemsArray.value = itemsArray.value.map((item) =>
        item.id === partial.id
          ? { ...item, ...partial, id: `${partial.id}` }
          : item,
      );
    };

    const items = computed(() => itemsArray.value);

    return { items, itemsArray, updateItems, addItem, removeItem, updateItem };
  },
  { persist: true },
);
