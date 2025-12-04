<template>
  <div class="flex flex-col gap-2">
    <slot name="header" />
    <div v-for="(input, index) in model" :key="input.id">
      <BaseRecipeItemRow
        v-if="model[index]"
        v-model="model[index]"
        @update="onUpdateRow(index, model[index])"
        @remove="onRemoveRow(index)"
      />
    </div>

    <div class="flex gap-2 items-center">
      <Button variant="outline" @click="addInput">
        <Plus />
        Adicionar item
      </Button>
      <Button
        variant="outline"
        @click="onAddTax"
        :disabled="model.some((i) => i.itemId === 999999)"
      >
        <Coins />
        Adicionar Taxas
      </Button>
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { Coins, Plus } from "lucide-vue-next";
import { toast } from "vue-sonner";

const itemsStore = useItemsStore();
const taxItem = itemsStore.itemsMap.get(999999);

const model = defineModel<Recipe["inputs"]>({
  required: true,
});

const emit = defineEmits(["add-input", "add-tax", "update-row", "remove-row"]);

const addInput = () => {
  console.log("Adding input");
  model.value.push({
    id: "",
    itemId: 0,
    quantity: 1,
    buyPrice: 0,
    highAlch: 0,
    sellPrice: 0,
    itemName: "",
  });
};

const onAddTax = () => {
  if (!taxItem) return;
  model.value.push({
    id: "999999",
    itemId: 999999,
    quantity: 1,
    buyPrice: 1,
    highAlch: taxItem.highalch,
    sellPrice: 1,
    itemName: taxItem.name,
  });
};

const onUpdateRow = async (index: number, updatedRow: ItemRow) => {
  if (updatedRow.id === `${taxItem?.id}`) {
    if (model.value.some((i) => i.itemId === 999999)) {
      model.value.splice(index, 1);
      return;
    }
    onAddTax();
    model.value.splice(index, 1);
    return;
  }
  const { data: priceResponse } = await $fetch<OsrsItemPriceResponse>(
    `https://prices.runescape.wiki/api/v1/osrs/latest?id=${updatedRow.id}`,
  );

  if (!priceResponse) {
    toast.error("Failed to fetch item prices");
    throw new Error("Failed to fetch item prices");
  }

  const {
    success,
    data: parsedData,
    error: parseError,
  } = OsrsItemPriceSchema.safeParse(priceResponse[updatedRow.id]);

  if (parseError) {
    console.error("Failed to parse item price data", parseError);
    toast.error("Failed to parse item price data");
    throw new Error("Failed to parse item price data");
  }

  if (success) {
    const itemData = itemsStore.itemsMap.get(parseInt(updatedRow.id));
    if (!itemData) throw new Error("Item data not found in store");

    model.value[index] = {
      id: updatedRow.id,
      itemName: itemData.name,
      buyPrice: parsedData.low,
      sellPrice: parsedData.high,
      highAlch: itemData.highalch,
      quantity: updatedRow.quantity,
      itemId: parseInt(updatedRow.id),
    };
  }
};

const onRemoveRow = (index: number) => {
  model.value.splice(index, 1);
};
</script>
