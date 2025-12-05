<template>
  <div class="flex flex-col gap-2">
    <slot name="header" />
    <div v-for="(input, index) in model" :key="input.id">
      <BaseRecipeItemRow
        v-if="model[index]"
        v-model="model[index]"
        :items="
          itemsStore.items.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        "
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
        :disabled="model.some((i) => i.id === `999999`)"
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
import { computed, watch } from "vue";

const itemsStore = useItemsStore();

// taxItem reativo
const taxItem = computed(() => itemsStore.itemsMap.get("999999"));

const model = defineModel<Recipe["inputs"]>({
  required: true,
});

const emit = defineEmits(["add-input", "add-tax", "update-row", "remove-row"]);

const addInput = () => {
  model.value.push({
    id: "0",
    quantity: 1,
    buyPrice: 0,
    highAlch: 0,
    sellPrice: 0,
    name: "",
  });
};

const onAddTax = () => {
  if (!taxItem.value) return;
  model.value.push({
    id: "999999",
    quantity: 1,
    buyPrice: 1,
    highAlch: taxItem.value.highalch,
    sellPrice: 1,
    name: taxItem.value.name,
  });
};

const onUpdateRow = async (index: number, updatedRow: ItemRow) => {
  if (!taxItem.value) return;

  if (updatedRow.id === taxItem.value.id) {
    if (model.value.some((i) => taxItem.value && i.id === taxItem.value.id)) {
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
    const itemData = itemsStore.itemsMap.get(updatedRow.id);
    if (!itemData) throw new Error("Item data not found in store");

    model.value[index] = {
      id: updatedRow.id,
      name: itemData.name,
      buyPrice: parsedData.low,
      sellPrice: parsedData.high,
      highAlch: itemData.highalch,
      quantity: updatedRow.quantity,
    };
  }
};

const onRemoveRow = (index: number) => {
  model.value.splice(index, 1);
};
</script>
