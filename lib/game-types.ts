export type ShipType = "battleship" | "destroyer"
export type Orientation = "horizontal" | "vertical" | "diagonal-down" | "diagonal-up"
export type CellState = "empty" | "ship" | "hit" | "miss"

export interface Ship {
  id: string
  type: ShipType
  size: number
  placed: boolean
  startRow: number
  startCol: number
  orientation: Orientation
}

export interface Cell {
  row: number
  col: number
  state: CellState
  shipId?: string
}

export interface GameState {
  playerShips: Ship[]
  playerGrid: Cell[][]
  enemyShips: Ship[]
  enemyGrid: Cell[][]
  playerHits: number
  enemyHits: number
  currentTurn: "player" | "enemy"
  gameStatus: "setup" | "playing" | "victory" | "defeat"
}

export const GRID_SIZE = 10

export const INITIAL_SHIPS: Ship[] = [
  {
    id: "battleship",
    type: "battleship",
    size: 5,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
  {
    id: "destroyer-1",
    type: "destroyer",
    size: 2,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
  {
    id: "destroyer-2",
    type: "destroyer",
    size: 2,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
  {
    id: "destroyer-3",
    type: "destroyer",
    size: 2,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
  {
    id: "destroyer-4",
    type: "destroyer",
    size: 2,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
  {
    id: "destroyer-5",
    type: "destroyer",
    size: 2,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  },
]

export function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      row,
      col,
      state: "empty" as CellState,
    })),
  )
}

export function getShipCells(ship: Ship): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = []

  for (let i = 0; i < ship.size; i++) {
    let row = ship.startRow
    let col = ship.startCol

    switch (ship.orientation) {
      case "horizontal":
        col += i
        break
      case "vertical":
        row += i
        break
      case "diagonal-down":
        row += i
        col += i
        break
      case "diagonal-up":
        row -= i
        col += i
        break
    }

    cells.push({ row, col })
  }

  return cells
}

export function isValidPlacement(ship: Ship, grid: Cell[][], existingShips: Ship[]): boolean {
  const cells = getShipCells(ship)

  // Check if all cells are within bounds
  for (const cell of cells) {
    if (cell.row < 0 || cell.row >= GRID_SIZE || cell.col < 0 || cell.col >= GRID_SIZE) {
      return false
    }
  }

  // Check if any cell is already occupied by another ship
  for (const cell of cells) {
    const gridCell = grid[cell.row][cell.col]
    if (gridCell.state === "ship" && gridCell.shipId !== ship.id) {
      return false
    }
  }

  return true
}

export function placeShipOnGrid(ship: Ship, grid: Cell[][]): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  const cells = getShipCells(ship)

  for (const cell of cells) {
    newGrid[cell.row][cell.col] = {
      ...newGrid[cell.row][cell.col],
      state: "ship",
      shipId: ship.id,
    }
  }

  return newGrid
}

export function removeShipFromGrid(shipId: string, grid: Cell[][]): Cell[][] {
  return grid.map((row) =>
    row.map((cell) => (cell.shipId === shipId ? { ...cell, state: "empty", shipId: undefined } : cell)),
  )
}

export function adjustPlacementToFit(ship: Ship, row: number, col: number): { row: number; col: number } {
  let adjustedRow = row
  let adjustedCol = col

  // Calculate the cells the ship would occupy
  const cells: { row: number; col: number }[] = []
  for (let i = 0; i < ship.size; i++) {
    let cellRow = row
    let cellCol = col

    switch (ship.orientation) {
      case "horizontal":
        cellCol += i
        break
      case "vertical":
        cellRow += i
        break
      case "diagonal-down":
        cellRow += i
        cellCol += i
        break
      case "diagonal-up":
        cellRow -= i
        cellCol += i
        break
    }

    cells.push({ row: cellRow, col: cellCol })
  }

  // Check if any cells are out of bounds and adjust
  switch (ship.orientation) {
    case "horizontal":
      // If ship extends past right edge, shift left
      if (col + ship.size > GRID_SIZE) {
        adjustedCol = GRID_SIZE - ship.size
      }
      break
    case "vertical":
      // If ship extends past bottom edge, shift up
      if (row + ship.size > GRID_SIZE) {
        adjustedRow = GRID_SIZE - ship.size
      }
      break
    case "diagonal-down":
      // If ship extends past right or bottom edge, shift up-left
      if (col + ship.size > GRID_SIZE) {
        adjustedCol = GRID_SIZE - ship.size
      }
      if (row + ship.size > GRID_SIZE) {
        adjustedRow = GRID_SIZE - ship.size
      }
      break
    case "diagonal-up":
      // If ship extends past top or right edge, shift down or left
      if (col + ship.size > GRID_SIZE) {
        adjustedCol = GRID_SIZE - ship.size
      }
      if (row - ship.size + 1 < 0) {
        adjustedRow = ship.size - 1
      }
      break
  }

  return { row: adjustedRow, col: adjustedCol }
}
