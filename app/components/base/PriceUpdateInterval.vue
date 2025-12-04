<template>
  <div class="flex flex-col items-center justify-center h-full p-2 gap-1">
    <label for="interval" class="text-xs text-zinc-700">
      Atualizar preços a cada:
    </label>
    <Input
      id="interval"
      min="10"
      max="3600"
      type="number"
      v-model="inputValue"
      class="w-full rounded px-2 py-1 text-center text-sm"
      @change="onChange"
    />
    <span class="text-xs text-zinc-500">segundos</span>
    <slot name="progress" :progress="progress" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useProgressTimer } from "@/lib/useProgressTimer";
const modelValue = defineModel<number>({ required: true });
const emit = defineEmits(["interval-changed"]);

const inputValue = ref(modelValue);
const { progress, restartTimer } = useProgressTimer(modelValue);

watch(modelValue, (val) => {
  inputValue.value = val;
});

function onChange(e: Event) {
  const value = Number((e.target as HTMLInputElement).value);
  if (!isNaN(value)) {
    modelValue.value = value;
    emit("interval-changed", value);
    restartTimer();
  }
}
</script>
