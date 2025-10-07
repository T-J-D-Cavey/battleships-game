import { cn } from "@/lib/utils"
import type { Orientation } from "@/lib/game-types"

interface ShipVisualProps {
  type: "battleship" | "destroyer"
  orientation: Orientation
  size?: number
  className?: string
}

export function ShipVisual({ type, orientation, size = 40, className }: ShipVisualProps) {
  const shipLength = type === "battleship" ? 5 : 2

  const getContainerDimensions = () => {
    const baseWidth = size * shipLength
    const baseHeight = size

    switch (orientation) {
      case "horizontal":
        return { width: baseWidth, height: baseHeight }
      case "vertical":
        // Swap dimensions for vertical orientation
        return { width: baseHeight, height: baseWidth }
      case "diagonal-down":
      case "diagonal-up":
        // For diagonal, use the diagonal length
        const diagonalLength = Math.sqrt(baseWidth * baseWidth + baseHeight * baseHeight)
        return { width: diagonalLength, height: diagonalLength }
    }
  }

  const dimensions = getContainerDimensions()
  const baseWidth = size * shipLength
  const baseHeight = size

  const getTransformStyle = () => {
    switch (orientation) {
      case "horizontal":
        return {
          transform: "none",
          transformOrigin: "center center",
        }
      case "vertical":
        return {
          transform: `rotate(90deg)`,
          transformOrigin: "center center",
        }
      case "diagonal-down":
        return {
          transform: `rotate(45deg)`,
          transformOrigin: "center center",
        }
      case "diagonal-up":
        return {
          transform: `rotate(-45deg)`,
          transformOrigin: "center center",
        }
    }
  }

  const transformStyle = getTransformStyle()

  if (type === "destroyer") {
    return (
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={baseWidth}
          height={baseHeight}
          viewBox="0 0 80 40"
          className={cn("transition-transform", className)}
          style={transformStyle}
        >
          {/* Ship hull */}
          <path d="M 5 20 L 20 5 L 60 5 L 75 20 L 60 35 L 20 35 Z" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
          {/* Inner hull detail */}
          <path d="M 10 20 L 22 10 L 58 10 L 70 20 L 58 30 L 22 30 Z" fill="#4b5563" stroke="#374151" strokeWidth="1" />
          {/* Gun turret */}
          <ellipse cx="40" cy="20" rx="8" ry="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="38" y="12" width="4" height="6" fill="#1f2937" rx="1" />
          {/* Deck details */}
          <circle cx="25" cy="20" r="2" fill="#1f2937" opacity="0.6" />
          <circle cx="55" cy="20" r="2" fill="#1f2937" opacity="0.6" />
        </svg>
      </div>
    )
  } else {
    return (
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={baseWidth}
          height={baseHeight}
          viewBox="0 0 200 40"
          className={cn("transition-transform", className)}
          style={transformStyle}
        >
          {/* Ship hull */}
          <path d="M 5 20 L 25 5 L 175 5 L 195 20 L 175 35 L 25 35 Z" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
          {/* Inner hull detail */}
          <path
            d="M 10 20 L 27 10 L 173 10 L 190 20 L 173 30 L 27 30 Z"
            fill="#4b5563"
            stroke="#374151"
            strokeWidth="1"
          />
          {/* Front gun turrets */}
          <ellipse cx="50" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="47" y="10" width="6" height="8" fill="#1f2937" rx="1" />
          <ellipse cx="80" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="77" y="10" width="6" height="8" fill="#1f2937" rx="1" />
          {/* Center command structure */}
          <rect x="95" y="15" width="10" height="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" rx="1" />
          {/* Rear gun turrets */}
          <ellipse cx="120" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="117" y="10" width="6" height="8" fill="#1f2937" rx="1" />
          <ellipse cx="150" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="147" y="10" width="6" height="8" fill="#1f2937" rx="1" />
          {/* Deck details */}
          <circle cx="35" cy="20" r="2" fill="#1f2937" opacity="0.6" />
          <circle cx="165" cy="20" r="2" fill="#1f2937" opacity="0.6" />
        </svg>
      </div>
    )
  }
}
