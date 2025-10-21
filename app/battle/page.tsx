"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GameGrid } from "@/components/game-grid"
import { Target, Shield, ArrowLeft, Crosshair } from "lucide-react"
import type { Ship, Cell } from "@/lib/game-types"
import { createEmptyGrid } from "@/lib/game-types"
import { initializeEnemyFleet, makeEnemyMove, processAttack, checkGameEnd } from "@/lib/game-logic"
import { saveGameState, loadGameState, clearGameState } from "@/lib/storage"

export default function BattlePage() {
  const router = useRouter()
  const [view, setView] = useState<"attack" | "defense">("attack")
  const [playerShips, setPlayerShips] = useState<Ship[]>([])
  const [playerGrid, setPlayerGrid] = useState<Cell[][]>(createEmptyGrid())
  const [enemyShips, setEnemyShips] = useState<Ship[]>([])
  const [enemyGrid, setEnemyGrid] = useState<Cell[][]>(createEmptyGrid())
  const [playerHits, setPlayerHits] = useState(0)
  const [enemyHits, setEnemyHits] = useState(0)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [message, setMessage] = useState("ENEMY IN RANGE. SELECT SEA TILE FOR US TO TARGET")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastEnemyHit, setLastEnemyHit] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    const savedState = loadGameState()

    if (!savedState.playerShips || !savedState.playerGrid) {
      router.push("/position-ships")
      return
    }

    setPlayerShips(savedState.playerShips)
    setPlayerGrid(savedState.playerGrid)

    // Restore battle state if available
    if (savedState.enemyShips && savedState.enemyGrid) {
      setEnemyShips(savedState.enemyShips)
      setEnemyGrid(savedState.enemyGrid)
      setPlayerHits(savedState.playerHits || 0)
      setEnemyHits(savedState.enemyHits || 0)
      setView(savedState.currentView || "attack")
      setSelectedCell(savedState.selectedCell || null)
      setLastEnemyHit(savedState.lastEnemyHit || null)
    } else {
      // Initialize new battle
      const { ships, grid } = initializeEnemyFleet()
      setEnemyShips(ships)
      setEnemyGrid(grid)
    }
  }, [router])

  useEffect(() => {
    if (enemyShips.length > 0) {
      saveGameState({
        playerShips,
        playerGrid,
        enemyShips,
        enemyGrid,
        playerHits,
        enemyHits,
        currentView: view,
        selectedCell,
        lastEnemyHit,
      })
    }
  }, [playerShips, playerGrid, enemyShips, enemyGrid, playerHits, enemyHits, view, selectedCell, lastEnemyHit])

  const handleCellClick = (row: number, col: number) => {
    if (view !== "attack" || isProcessing) return

    const cell = enemyGrid[row][col]
    if (cell.state === "hit" || cell.state === "miss") {
      setMessage("COORDINATES ALREADY TARGETED")
      return
    }

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      handleConfirmAttack()
    } else {
      setSelectedCell({ row, col })
      setMessage("SELECT SEA TILE AGAIN TO INITIATE ATTACK OR CHOOSE NEW TARGET")
    }
  }

  const handleConfirmAttack = async () => {
    if (!selectedCell || isProcessing) return

    setIsProcessing(true)
    setMessage("FIRING...")

    const newEnemyGrid = enemyGrid.map((row) => row.map((cell) => ({ ...cell })))
    const attackResult = processAttack(selectedCell.row, selectedCell.col, newEnemyGrid, enemyShips)

    setEnemyGrid(newEnemyGrid)

    if (attackResult.hit) {
      setPlayerHits((prev) => prev + 1)
      setMessage(attackResult.sunk ? "ENEMY VESSEL SUNK!" : "DIRECT HIT OF ENEMY BATTLESHIP!")
    } else {
      setMessage("MISS - NO CONTACT!")
    }

    const gameEndResult = checkGameEnd(
      enemyShips,
      playerShips,
      newEnemyGrid,
      playerGrid,
      playerHits + (attackResult.hit ? 1 : 0),
      enemyHits,
    )
    if (gameEndResult.gameOver) {
      setTimeout(() => {
        saveGameState({
          gameResult: gameEndResult.winner === "player" ? "victory" : "defeat",
          playerHits: playerHits + (attackResult.hit ? 1 : 0),
          enemyHits: enemyHits,
          endReason: gameEndResult.reason,
        })
        router.push("/result")
      }, 2000)
      return
    }

    setTimeout(() => {
      setMessage("SWITCHING VIEW TO HOME SEA ZONE...")

      setTimeout(() => {
        setView("defense")
        setMessage("ENEMY FIRE INCOMING!")
        setLastEnemyHit(null)

        setTimeout(
          () => {
            const enemyTarget = makeEnemyMove(playerGrid, playerShips)
            const newPlayerGrid = playerGrid.map((row) => row.map((cell) => ({ ...cell })))
            const enemyAttackResult = processAttack(enemyTarget.row, enemyTarget.col, newPlayerGrid, playerShips)

            setLastEnemyHit(enemyTarget)
            setPlayerGrid(newPlayerGrid)

            if (enemyAttackResult.hit) {
              setEnemyHits((prev) => prev + 1)
              setMessage(
                enemyAttackResult.sunk
                  ? "A VESSEL OF OURS HAS BEEN DESTROYED!"
                  : "ENEMY SCORED A DIRECT HIT OF OUR BATTLESHIP!",
              )
            } else {
              setMessage("ENEMY MISSED")
            }

            const gameEndResult2 = checkGameEnd(
              enemyShips,
              playerShips,
              newEnemyGrid,
              newPlayerGrid,
              playerHits + (attackResult.hit ? 1 : 0),
              enemyHits + (enemyAttackResult.hit ? 1 : 0),
            )
            if (gameEndResult2.gameOver) {
              setTimeout(() => {
                saveGameState({
                  gameResult: gameEndResult2.winner === "player" ? "victory" : "defeat",
                  playerHits: playerHits + (attackResult.hit ? 1 : 0),
                  enemyHits: enemyHits + (enemyAttackResult.hit ? 1 : 0),
                  endReason: gameEndResult2.reason,
                })
                router.push("/result")
              }, 2000)
              return
            }

            setTimeout(() => {
              setMessage("SWITCHING VIEW TO ENEMY SEA ZONE...")

              setTimeout(() => {
                setView("attack")
                setMessage("SELECT SEA TILE FOR US TO TARGET")
                setSelectedCell(null)
                setLastEnemyHit(null)
                setIsProcessing(false)
              }, 2000)
            }, 2000)
          },
          Math.random() * 2000 + 2000,
        )
      }, 2000)
    }, 2000)
  }

  const handleRetreat = () => {
    clearGameState()
    router.push("/")
  }

  return (
    <div className="min-h-screen ocean-texture p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-[min(100%,1200px)] mx-auto">
          <div className="metallic-panel p-4 mb-8 rounded">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                className="metallic-panel hover:border-2 border-steel-light hover:border-rader-glow bg-transparent w-full md:w-auto"
                onClick={handleRetreat}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                RETREAT
              </Button>

              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-wider text-foreground text-center flex-1 md:mr-32">
                SEA BATTLE
              </h1>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              className={`flex-1 h-14 metallic-panel ${view === "attack" ? "glow-border" : "border-steel-light"}`}
              variant={view === "attack" ? "default" : "outline"}
              onClick={() => !isProcessing && setView("attack")}
              disabled={isProcessing}
            >
              <Crosshair className="w-5 h-5 mr-2" />
              ENEMY SEA ZONE
            </Button>
            <Button
              className={`flex-1 h-14 metallic-panel ${view === "defense" ? "glow-border" : "border-steel-light"}`}
              variant={view === "defense" ? "default" : "outline"}
              onClick={() => !isProcessing && setView("defense")}
              disabled={isProcessing}
            >
              <Shield className="w-5 h-5 mr-2" />
              HOME SEA ZONE
            </Button>
          </div>

          <div className="metallic-panel mb-6 rounded">
            <div className="flex items-center justify-center h-18 min-h-fit">
              <p className="text-base text-radar-glow font-mono text-center font-bold">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center lg:justify-center max-w-[min(100%,1200px)] mx-auto">
          <div className="flex justify-center w-full lg:w-auto">
            {view === "attack" ? (
              <div className="relative border-2 border-radar-glow glow-border">
                <GameGrid
                  grid={enemyGrid}
                  onCellClick={handleCellClick}
                  showShips={false}
                  highlightCells={selectedCell ? [selectedCell] : []}
                  className="opacity-90"
                />
              </div>
            ) : (
              <div className="relative border-2 border-destructive destructive-border-glow">
                <GameGrid grid={playerGrid} showShips={true} highlightCells={lastEnemyHit ? [lastEnemyHit] : []} />
              </div>
            )}
          </div>

          <Card className="metallic-panel p-6 w-full lg:w-80 lg:flex-shrink-0">
            <h2 className="text-xl font-bold tracking-wide mb-6 text-foreground">DAMAGE REPORT</h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair className="w-5 h-5 text-radar-glow" />
                  <h3 className="font-bold text-sm tracking-wide">INFLICTED DAMAGE:</h3>
                </div>
                <div className="metallic-panel p-4 rounded">
                  <div className="text-4xl font-bold text-radar-glow font-mono">{playerHits}</div>
                  <div className="text-xs text-muted-foreground mt-1">DIRECT HITS TO ENEMY FLEET</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold text-sm tracking-wide">DAMAGE SUSTAINED</h3>
                </div>
                <div className="metallic-panel p-4 rounded">
                  <div className="text-4xl font-bold text-destructive font-mono">{enemyHits}</div>
                  <div className="text-xs text-muted-foreground mt-1">DIRECT HITS TO OUR FLEET</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
