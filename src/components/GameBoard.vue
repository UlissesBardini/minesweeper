<script setup lang="ts">
import Cell from '@/models/Cell';
import getRandomPositions from '@/utils/getRandomPositions';
import type Settings from '@models/Settings';

const emit = defineEmits<{
  startGame: [];
  finishGame: [win: boolean];
}>();

let firstClick = true;
let revealedCells = 0;

const model = defineModel<Settings>({ required: true });
const flags = defineModel<number>("flags", { required: true });
const isGameRunning = defineModel<boolean>("isGameRunning", { required: true });

const cells = ref(generateCells());

function generateCells(): Cell[][] {
  return Array.from(
    { length: model.value.rows },
    (_, row) => Array.from(
      { length: model.value.columns },
      (_, column) => ({ row, column, state: "unrevealed", isAMine: false }))
  );
}

function setMines() {
  const positions = getRandomPositions(cells.value, model.value.mines);
  for (let i = 0; i < model.value.mines; i++) {
    const [row, col] = positions[i];
    cells.value[row][col].isAMine = true;
  }
}

function applyBorder(i: number, j: number) {
  if (i === model.value.rows) {
    if (j === 1) {
      return "rounded-bottom-start-1";
    }
    if (j === model.value.columns) {
      return "rounded-bottom-end-1";
    }
  }
}

function revealAllMines() {
  cells.value.forEach((row) => {
    row.forEach((cell) => {
      if (cell.state === "flagged") {
        if (!cell.isAMine) {
          cell.state = "misflagged";
        }
      } else if (cell.isAMine) {
        cell.state = "exploded"
      }
    })
  });
  emit("finishGame", false);
}

type CountIfFunction = (cell: Cell) => boolean

function countAdjacentCells({ row, column }: Cell, countIf: CountIfFunction) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = column - 1; j <= column + 1; j++) {
      if (countIf(cells.value[i]?.[j])) {
        count++;
      }
    }   
  }
  return count;
}

function countAdjacentMines(cell: Cell) {
  return countAdjacentCells(cell, cell => cell?.isAMine);
}

function countAdjacentFlags(cell: Cell) {
  return countAdjacentCells(cell, cell => cell?.state === "flagged");
}

function revealAdjacentCells(cell: Cell, chord?: boolean) {
  const { row, column } = cell;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = column - 1; j <= column + 1; j++) {
      if (i === row && j === column) {
        continue;
      }
      revealCell(cells.value[i]?.[j], chord);
    }   
  }
}

function revealCell(cell: Cell | null, chord?: boolean) {
  if (cell?.state === "unrevealed" || (cell?.state === "flagged" && !chord)) {
    const adjacentMines = countAdjacentMines(cell);
    cell.adjacentMines = adjacentMines;
    
    if (cell.state === "flagged") {
      flags.value++;
    }

    if (cell.isAMine) {
      revealAllMines();
    } else {
      cell.state = "revealed";
    }

    if (!adjacentMines) {
        revealAdjacentCells(cell);
    }
    revealedCells++;
    const { columns, rows, mines } = model.value;
    if (revealedCells === (columns * rows) - mines) {
        emit("finishGame", true);
    }
  }
}

function repositionMine(cell: Cell) {
  cell.isAMine = false;
  for (const row of cells.value) {
    for (const currCell of row) {
      if (!currCell.isAMine && currCell !== cell) {
        currCell.isAMine = true;
        return;
      }
    }
  }
  cells.value.some(row => {
    row.some(currCell => {
      if (!currCell.isAMine) {
        currCell.isAMine = true;
        return true;
      }
    })
  });
}

function revealOnClick(cell: Cell) {
  if (isGameRunning.value || firstClick) {
    if (cell.state === "unrevealed") {
      if (cell?.isAMine) {
        if (firstClick) {
          repositionMine(cell);
        } else {
          return revealAllMines();
        }
      }
      if (firstClick) {
        emit("startGame");
        firstClick = false;
      }
      revealCell(cell);
    }
  }
}

function flag(cell: Cell) {
  if (isGameRunning.value) {
    if (cell.state === "unrevealed" && flags.value > 0) {
      cell.state = "flagged";
      flags.value--;
    } else if (cell.state === "flagged") {
      cell.state = "unrevealed";
      flags.value++;
    }
  }
}

function chord(cell: Cell) {
  if (cell.state === "unrevealed") {
    revealOnClick(cell);
  } else if (isGameRunning.value) {
    const adjacentFlags = countAdjacentFlags(cell);
    const adjacentMines = countAdjacentMines(cell);
    if (adjacentFlags === adjacentMines) {
      revealAdjacentCells(cell, true);
    }
  }
}

setMines();
watch(model, _ => {
  cells.value = generateCells();
  setMines();
  firstClick = true;
  revealedCells = 0;
});
</script>

<template>
  <section
    class="d-flex flex-column"
    @contextmenu.prevent>
    <div
      v-for="i in model.rows"
      :key="i"
      class="d-flex flex-row"
    >
      <GameCell
        v-model="cells[i-1][j-1]"
        v-for="j in model.columns"
        :key="j"
        class="flex-column"
        :class="applyBorder(i, j)"
        @click="revealOnClick"
        @scrollclick="chord"
        @leftclick="flag"
      />
    </div>
  </section>
</template>

<style scoped>
section {
  width: max-content;
}

.rounded-bottom-start-1 {
  border-bottom-left-radius: 0.25em;
}

.rounded-bottom-end-1 {
  border-bottom-right-radius: 0.25em;
}
</style>