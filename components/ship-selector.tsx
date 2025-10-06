"use client"

import type { Ship, Orientation } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCw, Anchor } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShipSelectorProps {
  ships: Ship[]
  selectedShip: Ship | null
  onSelectShip: (ship: Ship) => void
  onRotateShip: (ship: Ship) => void
}

export function ShipSelector({ ships, selectedShip, onSelectShip, onRotateShip }: ShipSelectorProps) {
  const getOrientationLabel = (orientation: Orientation) => {
    switch (orientation) {
      case "horizontal":
        return "HORIZONTAL"
      case "vertical":
        return "VERTICAL"
      case "diagonal-down":
        return "DIAGONAL ↘"
      case "diagonal-up":
        return "DIAGONAL ↗"
    }
  }

  const renderShipVisual = (ship: Ship) => {
    const tiles = Array.from({ length: ship.size })

    if (ship.orientation === "horizontal") {
      return (
        <div className="flex gap-1">
          {tiles.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-sm border border-steel-light/40 relative",
                ship.placed ? "bg-steel-dark/40" : "bg-gradient-to-br from-steel-light/80 to-steel-dark/60",
              )}
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
            </div>
          ))}
        </div>
      )
    } else if (ship.orientation === "vertical") {
      return (
        <div className="flex flex-col gap-1">
          {tiles.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-sm border border-steel-light/40 relative",
                ship.placed ? "bg-steel-dark/40" : "bg-gradient-to-br from-steel-light/80 to-steel-dark/60",
              )}
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
            </div>
          ))}
        </div>
      )
    } else if (ship.orientation === "diagonal-down") {
      return (
        <div className="relative h-24">
          {tiles.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-sm border border-steel-light/40 absolute",
                ship.placed ? "bg-steel-dark/40" : "bg-gradient-to-br from-steel-light/80 to-steel-dark/60",
              )}
              style={{ left: `${i * 8}px`, top: `${i * 8}px` }}
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
            </div>
          ))}
        </div>
      )
    } else {
      // diagonal-up
      return (
        <div className="relative h-24">
          {tiles.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-sm border border-steel-light/40 absolute",
                ship.placed ? "bg-steel-dark/40" : "bg-gradient-to-br from-steel-light/80 to-steel-dark/60",
              )}
              style={{ left: `${i * 8}px`, bottom: `${i * 8}px` }}
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
              <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-steel-dark/60" />
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <Card className="metallic-panel p-6">
      <h2 className="text-xl font-bold tracking-wide mb-4 text-foreground flex items-center gap-2">
        <Anchor className="w-5 h-5 text-radar-glow" />
        FLEET ROSTER
      </h2>

      <div className="space-y-3">
        {ships.map((ship) => (
          <div
            key={ship.id}
            className={cn(
              "p-4 rounded border-2 transition-all cursor-pointer",
              ship.placed && "opacity-50 border-steel-light/30 bg-steel-dark/20",
              !ship.placed && selectedShip?.id === ship.id && "border-radar-glow glow-border bg-ocean-surface/20",
              !ship.placed && selectedShip?.id !== ship.id && "border-steel-light/50 hover:border-radar-glow/50",
              ship.type === "destroyer" && "p-3",
            )}
            onClick={() => !ship.placed && onSelectShip(ship)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-sm tracking-wide text-foreground">
                  {ship.type === "battleship" ? "BATTLESHIP" : `DESTROYER ${ship.id.split("-")[1]}`}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {ship.size} {ship.size === 1 ? "TILE" : "TILES"}
                </div>
              </div>

              {ship.placed && <div className="text-xs font-bold text-radar-glow">DEPLOYED</div>}
            </div>

            {!ship.placed && selectedShip?.id === ship.id && ship.type === "battleship" && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-steel-light/30">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs metallic-panel border-steel-light hover:border-radar-glow bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRotateShip(ship)
                  }}
                >
                  <RotateCw className="w-3 h-3 mr-1" />
                  ROTATE
                </Button>
                <div className="text-xs text-muted-foreground font-mono">{getOrientationLabel(ship.orientation)}</div>
              </div>
            )}

            <div className={cn("flex justify-center", ship.type === "destroyer" ? "mt-2" : "mt-3")}>
              {renderShipVisual(ship)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
