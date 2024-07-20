<script setup lang="ts">
import Cell from '@models/Cell';

const emit = defineEmits<{
  click: [cell: Cell],
  scrollclick: [cell: Cell],
  leftclick: [cell: Cell]
}>();

const model = defineModel<Cell>({ required: true });

function getCellContent() {
  if (model.value.state === "revealed") {
    return model.value.adjacentMines ? model.value.adjacentMines : "";
  }
  if (model.value.state === "flagged" || model.value.state === "misflagged") {
    return "🚩";
  }
  if (model.value.state === "exploded") {
    return "💥"
  }
}

function handleAuxClick(event: MouseEvent) {
  if (event.button === 1) {
    emit("scrollclick", model.value);
  }
  if (event.button === 2) {
    emit("leftclick", model.value);
  }
}
</script>

<template>
  <div
    class="cell"
    :class="model.state"
    :style="`color: var(--text-${model.adjacentMines})`"
    @click="$emit('click', model)"
    @auxclick="handleAuxClick"
  >
    {{ getCellContent() }}
  </div>
</template>

<style>
.cell {
  --unrevealed-background-light: #AAD751;
  --unrevealed-background-dark: #A2D149;
  --unrevealed-background-hover: #B9DD77;
  --revealed-background-light: #E5C29F;
  --revealed-background-dark: #D7B899;
  --revealed-background-hover: #E1CAB3;
  --exploded-background: #DB3236;
  --misflagged-background: #d56b28;
  --text-1: #1976D2;
  --text-2: #388E3C;
  --text-3: #D32F2F;
  --text-4: #7B1FA2;
  --text-5: #FF8F00;
  --text-6: #4CA893;
  --text-7: #5D5038;
  --text-8: #C5B7A8;

  user-select: none;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;

  &.flagged, &.misflagged {
    font-size: 1.3em;
  }

  &.misflagged {
    background-color: var(--misflagged-background)
  }

  &.exploded {
    background-color: var(--exploded-background);
    font-size: 1.2em;
  }

  &:not(.exploded, .misflagged) {
    &:hover {
      background-color: var(--unrevealed-background-hover);

      &.revealed {
        background-color: var(--revealed-background-hover);
      }
    }

    &:not(:hover) {
      background-color: var(--unrevealed-background-light);

      &.revealed {
        background-color: var(--revealed-background-light);
      }

      .flex-row:nth-child(even) &:nth-child(odd),
      .flex-row:nth-child(odd) &:nth-child(even) {
        background-color: var(--unrevealed-background-dark);

        &.revealed {
          background-color: var(--revealed-background-dark);
        }
      }
    }
  }
}
</style>