"use client"

import type { Cell } from "@/lib/game-types"
import { cn } from "@/lib/utils"

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

  return (
    <div className={cn("inline-block metallic-panel p-4 rounded", className)}>
      {/* Grid coordinates */}
      <div className="flex mb-2">
        <div className="w-8" />
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-10 h-8 flex items-center justify-center text-xs font-mono text-radar-glow">
            {i}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          <div className="w-8 h-10 flex items-center justify-center text-xs font-mono text-radar-glow">{rowIndex}</div>
          {row.map((cell, colIndex) => {
            const shipType = getShipType(cell)
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                className={cn(
                  "w-10 h-10 border transition-all relative group",
                  "border-steel-light/30",
                  cell.state === "empty" &&
                    "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80 hover:brightness-110",
                  cell.state === "ship" &&
                    !showShips &&
                    "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80 hover:brightness-110",
                  cell.state === "ship" && showShips && "bg-steel-light/40 hover:bg-steel-light/60",
                  cell.state === "hit" && "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80",
                  cell.state === "miss" && "bg-gradient-to-br from-blue-600/80 via-blue-500/70 to-blue-700/80",
                  // Highlight
                  isHighlighted(rowIndex, colIndex) && "ring-2 ring-radar-glow bg-radar-glow/20",
                  // Cursor
                  onCellClick && "cursor-pointer",
                )}
              >
                {cell.state === "hit" && shipType === "battleship" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-600 to-red-800 border-2 border-yellow-400 animate-pulse shadow-lg shadow-red-500/50">
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-60" />
                    </div>
                  </div>
                )}

                {cell.state === "hit" && shipType === "destroyer" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400 animate-pulse" />
                  </div>
                )}

                {/* Miss marker */}
                {cell.state === "miss" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white opacity-60" />
                  </div>
                )}

                {/* Ship indicator */}
                {cell.state === "ship" && showShips && (
                  <div className="absolute inset-1 bg-gradient-to-br from-steel-light via-steel-dark to-steel-light rounded-sm opacity-90 border border-steel-light/60">
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/80" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/80" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/80" />
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/80" />
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
