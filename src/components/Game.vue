<script setup lang="ts">
import Settings from '@/models/Settings';

const model = defineModel<Settings>();
const flags = ref(model.value!.mines);
const time = ref(0);
const isGameRunning = ref(false);
let timer: NodeJS.Timeout;

function startGame() {
  clearInterval(timer);
  isGameRunning.value = true;
  timer = setInterval(() => time.value++, 1000);
}

function finishGame(win: boolean) {
  clearInterval(timer);
  alert(`You ${win ? "Won" : "Lost"}!`);
  isGameRunning.value = false;
}

watch(model, () => {
  flags.value = model.value!.mines;
  clearInterval(timer);
  time.value = 0;
  isGameRunning.value = false;
});
</script>

<template>
  <article class="d-flex justify-content-center mt-4">
    <div>
      <GameHeader :="{ flags, time }" class="rounded-top-1"/>
      <GameBoard
        v-model="model"
        v-model:flags="flags"
        v-model:isGameRunning="isGameRunning"
        @="{ startGame, finishGame }"
      />
    </div>
  </article>
</template>