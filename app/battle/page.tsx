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
  const [message, setMessage] = useState("SELECT TARGET COORDINATES")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastEnemyHit, setLastEnemyHit] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    const savedShips = localStorage.getItem("playerShips")
    const savedGrid = localStorage.getItem("playerGrid")

    if (!savedShips || !savedGrid) {
      router.push("/position-ships")
      return
    }

    setPlayerShips(JSON.parse(savedShips))
    setPlayerGrid(JSON.parse(savedGrid))

    const { ships, grid } = initializeEnemyFleet()
    setEnemyShips(ships)
    setEnemyGrid(grid)
  }, [router])

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
      setMessage("CONFIRM TARGET OR SELECT NEW COORDINATES")
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
      setMessage(attackResult.sunk ? "ENEMY VESSEL DESTROYED!" : "DIRECT HIT!")
    } else {
      setMessage("MISS - NO CONTACT")
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
        localStorage.setItem("gameResult", gameEndResult.winner === "player" ? "victory" : "defeat")
        localStorage.setItem("playerHits", (playerHits + (attackResult.hit ? 1 : 0)).toString())
        localStorage.setItem("enemyHits", enemyHits.toString())
        localStorage.setItem("endReason", gameEndResult.reason)
        router.push("/result")
      }, 2000)
      return
    }

    setTimeout(() => {
      setView("defense")
      setMessage("SWITCHING TO DEFENSIVE POSITION...")
      setLastEnemyHit(null)

      setTimeout(() => {
        setMessage("ENEMY TARGETING...")

        const enemyTarget = makeEnemyMove(playerGrid, playerShips)
        const newPlayerGrid = playerGrid.map((row) => row.map((cell) => ({ ...cell })))
        const enemyAttackResult = processAttack(enemyTarget.row, enemyTarget.col, newPlayerGrid, playerShips)

        setLastEnemyHit(enemyTarget)
        setPlayerGrid(newPlayerGrid)

        if (enemyAttackResult.hit) {
          setEnemyHits((prev) => prev + 1)
          setMessage(enemyAttackResult.sunk ? "YOUR VESSEL DESTROYED!" : "ENEMY HIT!")
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
            localStorage.setItem("gameResult", gameEndResult2.winner === "player" ? "victory" : "defeat")
            localStorage.setItem("playerHits", (playerHits + (attackResult.hit ? 1 : 0)).toString())
            localStorage.setItem("enemyHits", (enemyHits + (enemyAttackResult.hit ? 1 : 0)).toString())
            localStorage.setItem("endReason", gameEndResult2.reason)
            router.push("/result")
          }, 2000)
          return
        }

        setTimeout(() => {
          setView("attack")
          setMessage("SELECT TARGET COORDINATES")
          setSelectedCell(null)
          setLastEnemyHit(null)
          setIsProcessing(false)
        }, 3000)
      }, 5000)
    }, 2000)
  }

  return (
    <div className="min-h-screen ocean-texture p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-[min(100%,1200px)] mx-auto">
          <div className="metallic-panel p-4 mb-8 rounded">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                className="metallic-panel border-steel-light hover:border-radar-glow bg-transparent w-full md:w-auto"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                RETREAT
              </Button>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wider text-foreground text-center flex-1 md:mr-32">
                NAVAL COMBAT
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
              <Target className="w-5 h-5 mr-2" />
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

          <div className="metallic-panel p-4 mb-16 rounded">
            <p className="text-sm text-radar-glow font-mono text-center font-bold">{message}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center lg:justify-center max-w-[min(100%,1200px)] mx-auto">
          <div className="flex justify-center w-full lg:w-auto">
            {view === "attack" ? (
              <div className="relative">
                <div className="absolute -top-12 left-0 right-0 text-center mb-4">
                  <p className="text-xs text-muted-foreground font-mono">ENEMY TERRITORY - FOG OF WAR ACTIVE</p>
                </div>
                <GameGrid
                  grid={enemyGrid}
                  onCellClick={handleCellClick}
                  showShips={false}
                  highlightCells={selectedCell ? [selectedCell] : []}
                  className="opacity-90"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -top-12 left-0 right-0 text-center mb-4">
                  <p className="text-xs text-muted-foreground font-mono">YOUR FLEET - DEFENSIVE POSITION</p>
                </div>
                <GameGrid grid={playerGrid} showShips={true} highlightCells={lastEnemyHit ? [lastEnemyHit] : []} />
              </div>
            )}
          </div>

          <Card className="metallic-panel p-6 w-full lg:w-80 lg:flex-shrink-0">
            <h2 className="text-xl font-bold tracking-wide mb-6 text-foreground">COMBAT STATUS</h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crosshair className="w-5 h-5 text-radar-glow" />
                  <h3 className="font-bold text-sm tracking-wide">YOUR STRIKES</h3>
                </div>
                <div className="metallic-panel p-4 rounded">
                  <div className="text-4xl font-bold text-radar-glow font-mono">{playerHits}</div>
                  <div className="text-xs text-muted-foreground mt-1">SUCCESSFUL HITS</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold text-sm tracking-wide">ENEMY STRIKES</h3>
                </div>
                <div className="metallic-panel p-4 rounded">
                  <div className="text-4xl font-bold text-destructive font-mono">{enemyHits}</div>
                  <div className="text-xs text-muted-foreground mt-1">HITS SUSTAINED</div>
                </div>
              </div>

              {view === "attack" && selectedCell && (
                <Button
                  className="w-full h-14 metallic-panel glow-border hover:brightness-125 font-bold"
                  onClick={handleConfirmAttack}
                  disabled={isProcessing}
                >
                  <Target className="w-5 h-5 mr-2" />
                  FIRE WEAPONS
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
