<template>
  <main class="px-5 py-2">
    <slot />
    <Toaster />
  </main>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>
