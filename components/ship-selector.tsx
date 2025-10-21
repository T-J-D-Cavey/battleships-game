"use client"

import type { Ship, Orientation } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCw, Anchor } from "lucide-react"
import { cn } from "@/lib/utils"
import { ShipVisual } from "@/components/ship-visuals"

interface ShipSelectorProps {
  ships: Ship[]
  selectedShip: Ship | null
  onSelectShip: (ship: Ship) => void
  onRotateShip: (ship: Ship) => void
}

export function ShipSelector({ ships, selectedShip, onSelectShip, onRotateShip }: ShipSelectorProps) {
  const getOrientationLabel = (orientation: Orientation) => {
    return orientation === "horizontal" ? "HORIZONTAL" : "VERTICAL"
  }

  const renderShipVisual = (ship: Ship) => {
    return (
      <div className="flex items-center justify-center py-4">
        <ShipVisual type={ship.type} orientation={ship.orientation} size={30} />
      </div>
    )
  }

  return (
    <Card className="metallic-panel p-6">
      <h2 className="text-xl font-bold tracking-wide mb-4 text-foreground flex items-center gap-2">
        <Anchor className="w-5 h-5 text-radar-glow" />
        OUR FLEET
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

              {ship.placed && <div className="text-xs font-bold text-radar-glow">IN POSITION</div>}
            </div>

            {!ship.placed && selectedShip?.id === ship.id && (
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
