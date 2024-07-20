<script setup lang="ts">
import formatTime from "@/utils/formatTime";

const { flags } = defineProps<{
  flags: number;
}>();

const time = defineModel<number>("time", { required: true })
const timer = computed(() => formatTime(time.value));
</script>

<template>
  <header id="game-header" class="d-flex justify-content-center py-1">
    <div class="me-2">
      &#128337;{{ timer }}
    </div>
    <div>
      &#128681;{{ flags }}
    </div>
  </header>
</template>

<style scoped>
header {
  --header-background-color: #4A752C;
  background-color: var(--header-background-color);
}
</style>