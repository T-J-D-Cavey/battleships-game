"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GameGrid } from "@/components/game-grid"
import { ShipSelector } from "@/components/ship-selector"
import {
  type Ship,
  type Orientation,
  INITIAL_SHIPS,
  createEmptyGrid,
  getShipCells,
  isValidPlacement,
  placeShipOnGrid,
  removeShipFromGrid,
  adjustPlacementToFit,
} from "@/lib/game-types"
import { saveGameState, loadGameState, clearGameState } from "@/lib/storage"
import { ArrowLeft, Play } from "lucide-react"

export default function PositionShipsPage() {
  const router = useRouter()
  const [ships, setShips] = useState<Ship[]>(INITIAL_SHIPS)
  const [grid, setGrid] = useState(createEmptyGrid())
  const [selectedShip, setSelectedShip] = useState<Ship | null>({
    id: "battleship",
    type: "battleship",
    size: 5,
    placed: false,
    startRow: -1,
    startCol: -1,
    orientation: "horizontal",
  })
  const [previewCells, setPreviewCells] = useState<{ row: number; col: number }[]>([])
  const [rotationKey, setRotationKey] = useState(0)

  useEffect(() => {
    const savedState = loadGameState()
    if (savedState.playerShips && savedState.playerGrid) {
      setShips(savedState.playerShips)
      setGrid(savedState.playerGrid)

      if (savedState.selectedShipId) {
        const ship = savedState.playerShips.find((s) => s.id === savedState.selectedShipId)
        setSelectedShip(ship || null)
      } else {
        const nextUndeployedShip = savedState.playerShips.find((s) => !s.placed)
        setSelectedShip(nextUndeployedShip || null)
      }
    }
  }, [])

  useEffect(() => {
    saveGameState({
      playerShips: ships,
      playerGrid: grid,
      selectedShipId: selectedShip?.id,
    })
  }, [ships, grid, selectedShip])

  const handleSelectShip = (ship: Ship) => {
    setSelectedShip(ship)
    setPreviewCells([])
  }

  const handleRotateShip = (ship: Ship) => {
    const nextOrientation: Orientation = ship.orientation === "horizontal" ? "vertical" : "horizontal"

    const updatedShips = ships.map((s) => {
      if (s.id === ship.id) {
        return {
          ...s,
          orientation: nextOrientation,
        }
      }
      return s
    })

    setShips(updatedShips)
    if (selectedShip) {
      setSelectedShip({ ...selectedShip, orientation: nextOrientation })
    }
    setRotationKey((prev) => prev + 1)

    let newGrid = createEmptyGrid()
    updatedShips.forEach((s) => {
      if (s.placed) {
        newGrid = placeShipOnGrid(s, newGrid)
      }
    })
    setGrid(newGrid)
  }

  useEffect(() => {
    setPreviewCells([])
  }, [rotationKey])

  const handleCellHover = (row: number, col: number) => {
    if (!selectedShip) {
      setPreviewCells([])
      return
    }

    const adjusted = adjustPlacementToFit(selectedShip, row, col)
    const previewShip = { ...selectedShip, startRow: adjusted.row, startCol: adjusted.col }
    const cells = getShipCells(previewShip)

    const valid = isValidPlacement(previewShip, grid, ships)

    if (valid) {
      setPreviewCells(cells)
    } else {
      setPreviewCells([])
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (!selectedShip) return

    const adjusted = adjustPlacementToFit(selectedShip, row, col)
    const updatedShip = {
      ...selectedShip,
      startRow: adjusted.row,
      startCol: adjusted.col,
      placed: true,
    }

    if (!isValidPlacement(updatedShip, grid, ships)) {
      return
    }

    const newGrid = placeShipOnGrid(updatedShip, grid)
    setGrid(newGrid)

    const newShips = ships.map((s) => (s.id === selectedShip.id ? updatedShip : s))
    setShips(newShips)

    const nextUndeployedShip = newShips.find((s) => !s.placed)
    setSelectedShip(nextUndeployedShip || null)
    setPreviewCells([])
  }

  const handleRemoveShip = (ship: Ship) => {
    if (!ship.placed) return

    const newGrid = removeShipFromGrid(ship.id, grid)
    setGrid(newGrid)

    const newShips = ships.map((s) => (s.id === ship.id ? { ...s, placed: false, startRow: -1, startCol: -1 } : s))
    setShips(newShips)
  }

  const allShipsPlaced = ships.every((ship) => ship.placed)

  const handleStartBattle = () => {
    if (!allShipsPlaced) return
    router.push("/battle")
  }

  const handleAbortMission = () => {
    clearGameState()
    router.push("/")
  }

  return (
    <div className="min-h-screen ocean-texture p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-[min(100%,1200px)] mx-auto">
          <div className="metallic-panel p-4 mb-6 rounded">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                className="metallic-panel border-steel-light hover:border-radar-glow bg-transparent w-full md:w-auto h-16 md:h-auto"
                onClick={handleAbortMission}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-xs md:text-sm">
                  ABORT
                  <br className="md:hidden" /> MISSION
                </span>
              </Button>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wider text-foreground text-center">
                FLEET DEPLOYMENT
              </h1>

              <Button
                className="metallic-panel glow-border hover:brightness-125 w-full md:w-auto h-16 md:h-auto"
                disabled={!allShipsPlaced}
                onClick={handleStartBattle}
              >
                <Play className="w-4 h-4 mr-2" />
                <span className="text-xs md:text-sm">
                  BEGIN
                  <br className="md:hidden" /> BATTLE
                </span>
              </Button>
            </div>
          </div>
          {!allShipsPlaced && (
            <div className="metallic-panel mb-6 rounded">
              <div className="flex items-center justify-center h-12 min-h-fit">
                <p className="text-base text-radar-glow font-mono text-center font-bold">
                  {selectedShip
                    ? `SELECT SEA TILE TO PLACE ${selectedShip.type.toUpperCase()} OR SELECT ANOTHER SHIP FROM FLEET`
                    : "SELECT A SHIP THAT YOU WANT TO PLACE"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:justify-center max-w-[min(100%,1200px)] mx-auto">
          <div className="flex justify-center w-full lg:w-auto">
            <div
              key={rotationKey}
              onMouseLeave={() => setPreviewCells([])}
              onMouseMove={(e) => {
                const target = e.target as HTMLElement
                const button = target.closest("button")
                if (button) {
                  const row = Number.parseInt(button.getAttribute("data-row") || "-1")
                  const col = Number.parseInt(button.getAttribute("data-col") || "-1")
                  if (row >= 0 && col >= 0) {
                    handleCellHover(row, col)
                  }
                }
              }}
            >
              <GameGrid grid={grid} onCellClick={handleCellClick} showShips={true} highlightCells={previewCells} />
            </div>
          </div>

          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <ShipSelector
              ships={ships}
              selectedShip={selectedShip}
              onSelectShip={handleSelectShip}
              onRotateShip={handleRotateShip}
            />

            <Button
              variant="outline"
              className="w-full mt-4 metallic-panel border-steel-light hover:border-destructive bg-transparent"
              onClick={() => {
                setShips(INITIAL_SHIPS)
                setGrid(createEmptyGrid())
                setSelectedShip(null)
                setPreviewCells([])
                setRotationKey(0)
                clearGameState()
              }}
            >
              RESET DEPLOYMENT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
