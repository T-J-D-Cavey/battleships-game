"use client"

import type { Cell } from "@/lib/game-types"
import { cn } from "@/lib/utils"
import { ShipVisual } from "@/components/ship-visuals"
// Tim: I am unsure if these imports are correct, I am not using the stored values as the 'src' uses the direct path:
import seaTile from "@/public/sea-tile.png"
import seaTileMiss from "@/public/sea-tile-miss.png"
import seaTileHit from "@/public/sea-tile-hit.png"

interface GameGridProps {
  grid: Cell[][]
  onCellClick?: (row: number, col: number) => void
  showShips?: boolean
  highlightCells?: { row: number; col: number }[]
  className?: string
}

export function GameGrid({ grid, onCellClick, showShips = true, highlightCells = [], className }: GameGridProps) {
  const isHighlighted = (row: number, col: number) => {
    return highlightCells.some((cell) => cell.row === row && cell.col === col)
  }

  const getShipType = (cell: Cell): "battleship" | "destroyer" | null => {
    if (!cell.shipId) return null
    return cell.shipId === "battleship" ? "battleship" : "destroyer"
  }

  const isShipStart = (row: number, col: number): boolean => {
    const cell = grid[row][col]
    if (!cell.shipId || cell.state !== "ship") return false

    // Check if there's a ship cell to the left (horizontal)
    if (col > 0 && grid[row][col - 1].shipId === cell.shipId) return false
    // Check if there's a ship cell above (vertical)
    if (row > 0 && grid[row - 1][col].shipId === cell.shipId) return false
    // Check if there's a ship cell diagonally up-left (diagonal-down)
    if (row > 0 && col > 0 && grid[row - 1][col - 1].shipId === cell.shipId) return false
    if (row < 9 && col > 0 && grid[row + 1][col - 1].shipId === cell.shipId) return false

    return true
  }

  const getShipOrientation = (
    row: number,
    col: number,
  ): "horizontal" | "vertical" | "diagonal-down" | "diagonal-up" => {
    const cell = grid[row][col]
    if (!cell.shipId) return "horizontal"

    // Check horizontal (right)
    if (col < 9 && grid[row][col + 1].shipId === cell.shipId) {
      return "horizontal"
    }

    // Check vertical (down)
    if (row < 9 && grid[row + 1][col].shipId === cell.shipId) {
      return "vertical"
    }

    // Check diagonal-down (down-right)
    if (row < 9 && col < 9 && grid[row + 1][col + 1].shipId === cell.shipId) {
      return "diagonal-down"
    }

    // Check diagonal-up (down-right but going up visually)
    if (row > 0 && col < 9 && grid[row - 1][col + 1].shipId === cell.shipId) {
      return "diagonal-up"
    }
    return "horizontal"
  }

  const getShipSize = (shipId: string): number => {
    return shipId === "battleship" ? 5 : 2
  }
  // Tim: This function is not being called anywhere. Could be a clue for orientaion bug:
  /*
  const getShipPositionClasses = (orientation: string) => {
    console.log('getShipPositionClasses is being called')
    switch (orientation) {
      case "horizontal":
        return "justify-start items-center"
      case "vertical":
        return "justify-center items-start"
      case "diagonal-down":
        return "justify-start items-start"
      case "diagonal-up":
        return "justify-start items-end"
      default:
        return "justify-start items-center"
    }
  }

  // Tim: this function is not being called anywhere. Could be a clue for orientaion bug:
  const getShipTransform = (orientation: string, shipType: "battleship" | "destroyer") => {
    if (orientation === "diagonal-down") {
        console.log('This is the diaganol down logic')
      // Offset to align first tile with starting cell
      const shipLength = shipType === "battleship" ? 5 : 2
      const diagonalLength = 40 * Math.sqrt(2) * shipLength
      const offset = (diagonalLength - 40 * Math.sqrt(2)) / 2
      return `translate(-${offset}px, -${offset}px)`
    } else if (orientation === "diagonal-up") {
    console.log('diaganol up condition does fire')
      // Offset to align first tile with starting cell
      const shipLength = shipType === "battleship" ? 5 : 2
      const diagonalLength = 40 * Math.sqrt(2) * shipLength
      const offset = (diagonalLength - 40 * Math.sqrt(2)) / 2
      return `translate(-${offset}px, ${offset}px)`     
    }
    console.log('did we spot the bug?')
    return undefined
  }

  */
  

  return (
    <div className={cn("inline-block metallic-panel p-4 rounded", className)}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const shipType = getShipType(cell)
            const shouldRenderShip = showShips && cell.state === "ship" && isShipStart(rowIndex, colIndex)
            const shipOrientation = shouldRenderShip ? getShipOrientation(rowIndex, colIndex) : "horizontal"
            // Tim: adding code below to fix diagonal orientation bug:
            let transformStyle: string | undefined = undefined;
            if(shipOrientation === 'diagonal-up') {
              transformStyle = shipType === 'destroyer' ? 'translate(-0%, -55%)' : 'translate(-0%, -80%)'
            }
            const getTileImage = (state) => {
              switch (state) {
                case "empty":
                case "ship": 
                  return "/sea-tile.png"; 
                case "hit":
                  return "/sea-tile-hit.png";
                case "miss":
                  return "/sea-tile-miss.png";
                default:
                  return "/sea-tile.png";
    }
}
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                className={cn(
                  "w-10 h-10 border transition-all relative group overflow-visible",
                  "border-steel-light/30",
                  cell.state === "empty" &&
                    "hover:brightness-110",
                  cell.state === "ship" &&
                    !showShips &&
                    "hover:brightness-110",
                  isHighlighted(rowIndex, colIndex) && "ring-2 ring-radar-glow bg-radar-glow/20",
                  onCellClick && "cursor-pointer",
                )}
              >
                <img src={getTileImage(cell.state)} alt="sea" className="w-full h-full object-cover absolute inset-0" />
                {shouldRenderShip && shipType && (
                    /* I have added "transform: transformStyle" below as fix for diagonal orientation bug */
                  <div className="absolute top-0 left-0 pointer-events-none z-10" style={{ overflow: "visible", transform: transformStyle }}>
                    <ShipVisual type={shipType} orientation={shipOrientation} size={40} context="grid" />
                  </div>
                )}

                {cell.state === "hit" && shipType === "battleship" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-600 to-red-800 border-2 border-yellow-400 animate-pulse shadow-lg shadow-red-500/50">
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-60" />
                    </div>
                  </div>
                )}

                {cell.state === "hit" && shipType === "destroyer" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400 animate-pulse" />
                  </div>
                )}

                {cell.state === "miss" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full border-2 border-white opacity-60" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}


/*
Tim: original return before my changes. On line 227 I have had to add another note out value
return (
    <div className={cn("inline-block metallic-panel p-4 rounded", className)}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const shipType = getShipType(cell)
            const shouldRenderShip = showShips && cell.state === "ship" && isShipStart(rowIndex, colIndex)
            const shipOrientation = shouldRenderShip ? getShipOrientation(rowIndex, colIndex) : "horizontal"
            // Tim: adding code below to fix diagonal orientation bug:
            let transformStyle: string | undefined = undefined;
            if(shipOrientation === 'diagonal-up') {
              transformStyle = shipType === 'destroyer' ? 'translate(-0%, -55%)' : 'translate(-0%, -80%)'
            }
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                className={cn(
                  "w-10 h-10 border transition-all relative group overflow-visible",
                  "border-steel-light/30",
                  cell.state === "empty" &&
                    "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80 hover:brightness-110",
                  cell.state === "ship" &&
                    !showShips &&
                    "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80 hover:brightness-110",
                  cell.state === "ship" &&
                    showShips &&
                    "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80",
                  cell.state === "hit" && "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80",
                  cell.state === "miss" && "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80",
                  isHighlighted(rowIndex, colIndex) && "ring-2 ring-radar-glow bg-radar-glow/20",
                  onCellClick && "cursor-pointer",
                )}
              >
                {shouldRenderShip && shipType && (
                    /* I have added "transform: transformStyle" below as fix for diagonal orientation bug */ /*
                  <div className="absolute top-0 left-0 pointer-events-none z-10" style={{ overflow: "visible", transform: transformStyle }}>
                    <ShipVisual type={shipType} orientation={shipOrientation} size={40} context="grid" />
                  </div>
                )}

                {cell.state === "hit" && shipType === "battleship" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-600 to-red-800 border-2 border-yellow-400 animate-pulse shadow-lg shadow-red-500/50">
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-60" />
                    </div>
                  </div>
                )}

                {cell.state === "hit" && shipType === "destroyer" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400 animate-pulse" />
                  </div>
                )}

                {cell.state === "miss" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full border-2 border-white opacity-60" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
*/
