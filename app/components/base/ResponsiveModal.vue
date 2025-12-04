<template>
  <component :is="Modal.Root">
    <component :is="Modal.Trigger" as-child>
      <slot name="trigger">
        <Button variant="outline">Open Dialog</Button>
      </slot>
    </component>
    <component
      :is="Modal.Content"
      class="max-w-5xl w-full"
      :class="[{ 'px-2 pb-8 *:px-4': !isDesktop }]"
    >
      <component :is="Modal.Header">
        <component :is="Modal.Title">
          <slot name="title" />
        </component>
        <component :is="Modal.Description">
          <slot name="description" />
        </component>
      </component>

      <slot name="body" />

      <component :is="Modal.Footer">
        <slot name="footer"> </slot>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const isDesktop = useMediaQuery("(min-width: 640px)");

const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogClose : DrawerClose,
}));
</script>
