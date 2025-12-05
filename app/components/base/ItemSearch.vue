<template>
  <Popover v-model:open="open" class="w-full">
    <PopoverTrigger as-child class="w-full">
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-auto grow justify-between"
        :disabled="selectedOption === `999999`"
      >
        {{ selectedPlaceholder?.label || "Selecione um item..." }}
        <ChevronsUpDownIcon class="opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Procure um item..." />
        <CommandList>
          <CommandEmpty> Nenhum item encontrado. </CommandEmpty>
          <CommandGroup v-if="items.length && items.length > 0">
            <CommandItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              @select="
                (ev) => {
                  selectOption(ev.detail.value as string);
                }
              "
            >
              {{ item.label }}
              <CheckIcon
                :class="
                  cn(
                    'ml-auto',
                    selectedOption === item.value ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const props = defineProps<{
  items: Array<{ label: string; value: string }>;
}>();

const open = ref(false);

const emit = defineEmits<{ (e: "update", value: string): void }>();
const selectedOption = defineModel<string>();

const selectedPlaceholder = computed(() =>
  props.items.find((item) => item.value === selectedOption.value),
);

function selectOption(selectedValue: string) {
  selectedOption.value =
    selectedValue === selectedOption.value ? "" : selectedValue;
  open.value = false;
  emit("update", selectedOption.value);
}
</script>
