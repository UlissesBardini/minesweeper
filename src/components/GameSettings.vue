<script setup lang="ts">
import { Validation } from '@/models/Validation';
import type Settings from '@models/Settings';

const emit = defineEmits<{
  /** A function that passes the settings as a parameter */
  returnSettings: [settings: Settings]
}>();

type Difficulty = keyof typeof settings | "Custom";

const settings = {
  Easy: { rows: 8, columns: 10, mines: 10 },
  Medium: { rows: 14, columns: 18, mines: 40 },
  Hard: { rows: 20, columns: 24, mines: 99 },
  Custom: { rows: 8, columns: 10, mines: 10 }
} satisfies Record<string, Settings>;

const difficulties = Object.keys(settings) as Difficulty[];
const difficulty = ref<Difficulty>("Medium");
const currentSettings = ref<Settings>({...settings[difficulty.value]});

watch(difficulty, value => {
  currentSettings.value = settings[value];
  if (value !== "Custom") {
    settings.Custom = {...settings[value]};
  }
})

const isCustomDifficulty = computed(() => difficulty.value !== "Custom");

function startGame() {
  emit("returnSettings", {...currentSettings.value});
}

const isNumberPositive: Validation<number | undefined> = {
  rule: value => value! > 0,
  message: "The number must be positive"
}

const isNumberLessThan100: Validation<number | undefined> = {
  rule: value => value! <= 100,
  message: "The number must be less than or equal to 100"
}

const isMinesNumberValid: Validation<number | undefined> = {
  rule: value => value! < currentSettings.value.rows * currentSettings.value.columns,
  message: "The number of mines must not be greater than the size of the field"
}
</script>

<template>
  <form
    @submit.prevent
    inputmode="numeric"
    class="d-flex justify-content-between mx-auto"
  >
    <BaseSelect
      href="#"
      v-model="difficulty"
      option-label="id"
      :options="difficulties"
    >
      Difficulty
    </BaseSelect>
    <NumberInput
      v-model="currentSettings.rows"
      :size="2"
      :disabled="isCustomDifficulty"
      :validations="[ isNumberPositive, isNumberLessThan100 ]"
    >
      Rows
    </NumberInput>
    <NumberInput
      v-model="currentSettings.columns"
      :size="2"
      :disabled="isCustomDifficulty"
      :validations="[ isNumberPositive, isNumberLessThan100 ]"
    >
      Columns
    </NumberInput>
    <NumberInput
      v-model="currentSettings.mines"
      :size="2"
      :disabled="isCustomDifficulty"
      :validations="[ isNumberPositive, isMinesNumberValid ]"
    >
      Mines
    </NumberInput>
    <BaseButton
      class="mt-2em px-4"
      type="success"
      @click="startGame"
    >
      Start
    </BaseButton>
  </form>
</template>

<style>
form {
  width: 30em;
}

.mt-2em {
  margin-top: 2em;
}
</style>