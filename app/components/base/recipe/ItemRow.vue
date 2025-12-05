<template>
  <div class="flex flex-row gap-4 w-full">
    <BaseItemSearch
      v-model="model.id"
      :items="props.items"
      @update="(value) => emit('update', value)"
    />
    <BaseNumberField v-model="model.quantity" />
    <Button variant="destructive" @click="emit('remove')">
      <X />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";

const model = defineModel<ItemRow>({
  required: true,
});

const props = defineProps<{
  items: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: "update", value: string): void;
  (e: "remove"): void;
}>();
</script>
