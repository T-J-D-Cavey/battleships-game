import type { Orientation } from "@/lib/game-types"
import { getShipImagePath } from "@/lib/game-logic"
import Image from "next/image"

interface ShipVisualProps {
  type: "battleship" | "destroyer"
  orientation: Orientation
}

export function ShipVisual({ type, orientation }: ShipVisualProps) {
  const shipLength = type === "battleship" ? 5 : 2
  const tileSize = 40

  let width = tileSize
  let height = tileSize * shipLength
  let rotation = 0

  if (orientation === "horizontal") {
    width = tileSize * shipLength
    height = tileSize
    rotation = 0
  } else if (orientation === "vertical") {
    width = tileSize
    height = tileSize * shipLength
    rotation = 0
  } else if (orientation === "diagonal-down") {
    // Diagonal ships need square container for rotation
    width = tileSize * shipLength
    height = tileSize * shipLength
    rotation = 45
  } else if (orientation === "diagonal-up") {
    width = tileSize * shipLength
    height = tileSize * shipLength
    rotation = -45
  }

  const src = getShipImagePath(type)

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
      className="flex items-center justify-center"
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={`${type} ship`}
        width={orientation.includes("diagonal") ? tileSize * shipLength : width}
        height={orientation.includes("diagonal") ? tileSize : height}
        className="object-contain"
        style={{
          width: orientation.includes("diagonal") ? `${tileSize * shipLength}px` : "100%",
          height: orientation.includes("diagonal") ? `${tileSize}px` : "100%",
        }}
      />
    </div>
  )
}
