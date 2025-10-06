import type { Ship, Cell } from "./game-types"
import { GRID_SIZE, createEmptyGrid, getShipCells, INITIAL_SHIPS } from "./game-types"

export function initializeEnemyFleet(): { ships: Ship[]; grid: Cell[][] } {
  const ships: Ship[] = JSON.parse(JSON.stringify(INITIAL_SHIPS))
  const grid = createEmptyGrid()

  // Randomly place enemy ships
  for (const ship of ships) {
    let placed = false
    let attempts = 0

    while (!placed && attempts < 100) {
      const orientation = ["horizontal", "vertical", "diagonal-down", "diagonal-up"][
        Math.floor(Math.random() * 4)
      ] as Ship["orientation"]
      const startRow = Math.floor(Math.random() * GRID_SIZE)
      const startCol = Math.floor(Math.random() * GRID_SIZE)

      const testShip = { ...ship, orientation, startRow, startCol }
      const cells = getShipCells(testShip)

      // Check if all cells are valid and empty
      const valid = cells.every(
        (cell) =>
          cell.row >= 0 &&
          cell.row < GRID_SIZE &&
          cell.col >= 0 &&
          cell.col < GRID_SIZE &&
          grid[cell.row][cell.col].state === "empty",
      )

      if (valid) {
        ship.orientation = orientation
        ship.startRow = startRow
        ship.startCol = startCol
        ship.placed = true

        // Place ship on grid
        for (const cell of cells) {
          grid[cell.row][cell.col] = {
            ...grid[cell.row][cell.col],
            state: "ship",
            shipId: ship.id,
          }
        }

        placed = true
      }

      attempts++
    }
  }

  return { ships, grid }
}

export function makeEnemyMove(playerGrid: Cell[][], playerShips: Ship[]): { row: number; col: number } {
  // Simple AI: randomly target untargeted cells
  const availableCells: { row: number; col: number }[] = []

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = playerGrid[row][col]
      if (cell.state !== "hit" && cell.state !== "miss") {
        availableCells.push({ row, col })
      }
    }
  }

  if (availableCells.length === 0) {
    return { row: -1, col: -1 }
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)]
}

export function processAttack(
  row: number,
  col: number,
  grid: Cell[][],
  ships: Ship[],
): { hit: boolean; sunk: boolean; shipId?: string } {
  const cell = grid[row][col]

  if (cell.state === "ship") {
    // Hit!
    grid[row][col].state = "hit"

    // Check if ship is sunk
    const shipId = cell.shipId!
    const ship = ships.find((s) => s.id === shipId)!
    const shipCells = getShipCells(ship)
    const allHit = shipCells.every((c) => grid[c.row][c.col].state === "hit")

    return { hit: true, sunk: allHit, shipId }
  } else {
    // Miss
    grid[row][col].state = "miss"
    return { hit: false, sunk: false }
  }
}

export function checkGameEnd(
  enemyShips: Ship[],
  playerShips: Ship[],
  enemyGrid: Cell[][],
  playerGrid: Cell[][],
  playerHits: number,
  enemyHits: number,
): { gameOver: boolean; winner: "player" | "enemy" | null; reason: string } {
  // Check if enemy battleship is destroyed
  const enemyBattleship = enemyShips.find((s) => s.id === "battleship")
  if (enemyBattleship) {
    const enemyBattleshipCells = getShipCells(enemyBattleship)
    const enemyBattleshipDestroyed = enemyBattleshipCells.every((cell) => enemyGrid[cell.row][cell.col].state === "hit")
    if (enemyBattleshipDestroyed) {
      return { gameOver: true, winner: "player", reason: "Enemy battleship destroyed!" }
    }
  }

  // Check if player battleship is destroyed
  const playerBattleship = playerShips.find((s) => s.id === "battleship")
  if (playerBattleship) {
    const playerBattleshipCells = getShipCells(playerBattleship)
    const playerBattleshipDestroyed = playerBattleshipCells.every(
      (cell) => playerGrid[cell.row][cell.col].state === "hit",
    )
    if (playerBattleshipDestroyed) {
      return { gameOver: true, winner: "enemy", reason: "Your battleship destroyed!" }
    }
  }

  // Check if all enemy destroyers are destroyed
  const enemyDestroyersDestroyed = enemyShips
    .filter((s) => s.type === "destroyer")
    .every((ship) => {
      const cells = getShipCells(ship)
      return cells.every((cell) => enemyGrid[cell.row][cell.col].state === "hit")
    })

  if (enemyDestroyersDestroyed) {
    return {
      gameOver: true,
      winner: playerHits >= enemyHits ? "player" : "enemy",
      reason: "All enemy destroyers destroyed! Winner determined by total hits.",
    }
  }

  // Check if all player destroyers are destroyed
  const playerDestroyersDestroyed = playerShips
    .filter((s) => s.type === "destroyer")
    .every((ship) => {
      const cells = getShipCells(ship)
      return cells.every((cell) => playerGrid[cell.row][cell.col].state === "hit")
    })

  if (playerDestroyersDestroyed) {
    return {
      gameOver: true,
      winner: enemyHits >= playerHits ? "enemy" : "player",
      reason: "All your destroyers destroyed! Winner determined by total hits.",
    }
  }

  return { gameOver: false, winner: null, reason: "" }
}
