<template>
  <div class="flex gap-1">
    <Button variant="outline" @click="decrement"> <Minus /> </Button>
    <Input
      type="text"
      class="w-16 text-center"
      inputmode="numeric"
      pattern="[0-9]*"
      v-model="inputText"
    />
    <Button variant="outline" @click="increment"> <Plus /> </Button>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from "lucide-vue-next";

const inputValue = defineModel<number>({
  required: true,
  default: 1,
});

const inputText = computed<string>({
  get: () => inputValue.value.toString(),
  set: (val: string) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      inputValue.value = parsed;
    }
  },
});
const decrement = () => {
  if (inputValue.value > 0) {
    inputValue.value--;
  }
};
const increment = () => {
  inputValue.value++;
};
</script>
