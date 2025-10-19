import type { Orientation } from "@/lib/game-types"
import { getShipImagePath } from "@/lib/game-logic"
import Image from "next/image"

interface ShipVisualProps {
  type: "battleship" | "destroyer"
  orientation: Orientation
  size?: number // Added optional size prop for fleet roster scaling
}

export function ShipVisual({ type, orientation, size }: ShipVisualProps) {
  const shipLength = type === "battleship" ? 5 : 2
  const tileSize = size || 40 // Use custom size if provided, otherwise default to 40px

  // Horizontal: ship image is naturally horizontal (long and thin)
  // Vertical: rotate the horizontal image 90 degrees
  const isVertical = orientation === "vertical"

  // Base dimensions (for horizontal orientation)
  const baseWidth = tileSize * shipLength
  const baseHeight = tileSize

  const src = getShipImagePath(type, false)

  return (
    <div
      style={{
        width: isVertical ? `${baseHeight}px` : `${baseWidth}px`,
        height: isVertical ? `${baseWidth}px` : `${baseHeight}px`,
        position: "relative",
      }}
      className="flex items-center justify-center"
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={`${type} ship`}
        width={baseWidth}
        height={baseHeight}
        className={`object-contain ${isVertical ? "rotate-90" : ""}`}
        style={{
          maxWidth: "none",
          maxHeight: "none",
        }}
      />
    </div>
  )
}
