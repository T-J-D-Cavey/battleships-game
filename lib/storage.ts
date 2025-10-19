import type { Ship, Cell } from "./game-types"

const STORAGE_KEYS = {
  PLAYER_SHIPS: "battleships_playerShips",
  PLAYER_GRID: "battleships_playerGrid",
  ENEMY_SHIPS: "battleships_enemyShips",
  ENEMY_GRID: "battleships_enemyGrid",
  PLAYER_HITS: "battleships_playerHits",
  ENEMY_HITS: "battleships_enemyHits",
  GAME_RESULT: "battleships_gameResult",
  END_REASON: "battleships_endReason",
  SELECTED_SHIP_ID: "battleships_selectedShipId",
  CURRENT_VIEW: "battleships_currentView",
  SELECTED_CELL: "battleships_selectedCell",
  LAST_ENEMY_HIT: "battleships_lastEnemyHit",
} as const

export interface GameState {
  playerShips?: Ship[]
  playerGrid?: Cell[][]
  enemyShips?: Ship[]
  enemyGrid?: Cell[][]
  playerHits?: number
  enemyHits?: number
  gameResult?: "victory" | "defeat"
  endReason?: string
  selectedShipId?: string
  currentView?: "attack" | "defense"
  selectedCell?: { row: number; col: number } | null
  lastEnemyHit?: { row: number; col: number } | null
}

export function saveGameState(state: Partial<GameState>): void {
  try {
    if (state.playerShips !== undefined) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_SHIPS, JSON.stringify(state.playerShips))
    }
    if (state.playerGrid !== undefined) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_GRID, JSON.stringify(state.playerGrid))
    }
    if (state.enemyShips !== undefined) {
      localStorage.setItem(STORAGE_KEYS.ENEMY_SHIPS, JSON.stringify(state.enemyShips))
    }
    if (state.enemyGrid !== undefined) {
      localStorage.setItem(STORAGE_KEYS.ENEMY_GRID, JSON.stringify(state.enemyGrid))
    }
    if (state.playerHits !== undefined) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_HITS, state.playerHits.toString())
    }
    if (state.enemyHits !== undefined) {
      localStorage.setItem(STORAGE_KEYS.ENEMY_HITS, state.enemyHits.toString())
    }
    if (state.gameResult !== undefined) {
      localStorage.setItem(STORAGE_KEYS.GAME_RESULT, state.gameResult)
    }
    if (state.endReason !== undefined) {
      localStorage.setItem(STORAGE_KEYS.END_REASON, state.endReason)
    }
    if (state.selectedShipId !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SHIP_ID, state.selectedShipId)
    }
    if (state.currentView !== undefined) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, state.currentView)
    }
    if (state.selectedCell !== undefined) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CELL, JSON.stringify(state.selectedCell))
    }
    if (state.lastEnemyHit !== undefined) {
      localStorage.setItem(STORAGE_KEYS.LAST_ENEMY_HIT, JSON.stringify(state.lastEnemyHit))
    }
  } catch (error) {
    console.error("[v0] Error saving game state:", error)
  }
}

export function loadGameState(): GameState {
  try {
    const state: GameState = {}

    const playerShips = localStorage.getItem(STORAGE_KEYS.PLAYER_SHIPS)
    if (playerShips) state.playerShips = JSON.parse(playerShips)

    const playerGrid = localStorage.getItem(STORAGE_KEYS.PLAYER_GRID)
    if (playerGrid) state.playerGrid = JSON.parse(playerGrid)

    const enemyShips = localStorage.getItem(STORAGE_KEYS.ENEMY_SHIPS)
    if (enemyShips) state.enemyShips = JSON.parse(enemyShips)

    const enemyGrid = localStorage.getItem(STORAGE_KEYS.ENEMY_GRID)
    if (enemyGrid) state.enemyGrid = JSON.parse(enemyGrid)

    const playerHits = localStorage.getItem(STORAGE_KEYS.PLAYER_HITS)
    if (playerHits) state.playerHits = Number.parseInt(playerHits)

    const enemyHits = localStorage.getItem(STORAGE_KEYS.ENEMY_HITS)
    if (enemyHits) state.enemyHits = Number.parseInt(enemyHits)

    const gameResult = localStorage.getItem(STORAGE_KEYS.GAME_RESULT)
    if (gameResult) state.gameResult = gameResult as "victory" | "defeat"

    const endReason = localStorage.getItem(STORAGE_KEYS.END_REASON)
    if (endReason) state.endReason = endReason

    const selectedShipId = localStorage.getItem(STORAGE_KEYS.SELECTED_SHIP_ID)
    if (selectedShipId) state.selectedShipId = selectedShipId

    const currentView = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW)
    if (currentView) state.currentView = currentView as "attack" | "defense"

    const selectedCell = localStorage.getItem(STORAGE_KEYS.SELECTED_CELL)
    if (selectedCell) state.selectedCell = JSON.parse(selectedCell)

    const lastEnemyHit = localStorage.getItem(STORAGE_KEYS.LAST_ENEMY_HIT)
    if (lastEnemyHit) state.lastEnemyHit = JSON.parse(lastEnemyHit)

    return state
  } catch (error) {
    console.error("[v0] Error loading game state:", error)
    return {}
  }
}

export function clearGameState(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("[v0] Error clearing game state:", error)
  }
}

export function hasActiveGame(): boolean {
  return localStorage.getItem(STORAGE_KEYS.PLAYER_SHIPS) !== null
}
