<script setup lang="ts">
import Settings from './models/Settings';

const settings = ref<Settings>();
</script>

<template>
  <header class="text-center mt-3">
    <h1>Minesweeper</h1>
  </header>
  <main>
    <GameSettings
      class="mb-1"
      @return-settings="(s) => settings = s"
    />
    <Game v-if="settings" v-model="settings"/>
  </main>
  <footer>
    <h5 class="text-center mb-4 mt-2">Ulisses Viana Bardini, 2024</h5>
  </footer>
</template>

<style scoped>
main {
  min-height: 51em;
}
</style>
