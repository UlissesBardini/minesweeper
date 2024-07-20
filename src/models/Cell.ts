export type CellState = "revealed" | "flagged" | "unrevealed" | "exploded" | "misflagged";

export default interface Cell {
    readonly row: number;
    readonly column: number;
    state: CellState;
    adjacentMines?: number;
    isAMine: boolean
}