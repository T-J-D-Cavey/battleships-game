"use client"

import type { Ship, Orientation } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCw, Anchor, ArrowUpRight } from "lucide-react"
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
    switch (orientation) {
      case "horizontal":
        return "HORIZONTAL"
      case "vertical":
        return "VERTICAL"
      case "diagonal-down":
        // 45deg rotation points down-right
        return (
          <span className="flex items-center gap-1">
            DIAGONAL <ArrowUpRight className="w-3 h-3 text-radar-glow -scale-x-100" />
          </span>
        )
      case "diagonal-up":
        // -45deg rotation points up-right
        return (
          <span className="flex items-center gap-1">
            DIAGONAL <ArrowUpRight className="w-3 h-3 text-radar-glow" />
          </span>
        )
    }
  }

  const getShipVisualHeight = (ship: Ship) => {
    if (ship.type === "destroyer") {
      if (ship.orientation === "vertical") return "120px"
      if (ship.orientation === "diagonal-down" || ship.orientation === "diagonal-up") return "100px"
      return "60px"
    }
    // Battleship
    if (ship.orientation === "vertical") return "280px"
    if (ship.orientation === "diagonal-down" || ship.orientation === "diagonal-up") return "240px"
    return "80px"
  }

  const renderShipVisual = (ship: Ship) => {
    return (
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ minHeight: getShipVisualHeight(ship), width: "100%" }}
      >
        <ShipVisual type={ship.type} orientation={ship.orientation} size={24} />
      </div>
    )
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
