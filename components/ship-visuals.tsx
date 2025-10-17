import type { Orientation } from "@/lib/game-types"

interface ShipVisualProps {
  type: "battleship" | "destroyer"
  orientation: Orientation
  size?: number
  className?: string
  context?: "roster" | "grid"
}

export function ShipVisual({ type, orientation, size = 40, className, context = "roster" }: ShipVisualProps) {
  const shipLength = type === "battleship" ? 5 : 2
// Tim 17/10/25: This is where I want to replace the SVGs with images that have dynamically adjusted translate values for orientation and perhaps height / width based on screen size (?)
  const renderShip = () => {
    if (type === "destroyer") {
      // Destroyer SVG paths
      if (orientation === "horizontal") {
        return (
          <svg width={size * 2} height={size} viewBox="0 0 80 40" className={className}>
            <path d="M 5 20 L 20 5 L 60 5 L 75 20 L 60 35 L 20 35 Z" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
            <path
              d="M 10 20 L 22 10 L 58 10 L 70 20 L 58 30 L 22 30 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse cx="40" cy="20" rx="8" ry="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="38" y="12" width="4" height="6" fill="#1f2937" rx="1" />
            <circle cx="25" cy="20" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="55" cy="20" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else if (orientation === "vertical") {
        return (
          <svg width={size} height={size * 2} viewBox="0 0 40 80" className={className}>
            <path d="M 20 5 L 35 20 L 35 60 L 20 75 L 5 60 L 5 20 Z" fill="#6b7280" stroke="#1f2937" strokeWidth="2" />
            <path
              d="M 20 10 L 30 22 L 30 58 L 20 70 L 10 58 L 10 22 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse cx="20" cy="40" rx="6" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="12" y="38" width="6" height="4" fill="#1f2937" rx="1" />
            <circle cx="20" cy="25" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="20" cy="55" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else if (orientation === "diagonal-down") {
        const gridSize = size * 2
        return (
          <svg width={gridSize} height={gridSize} viewBox="0 0 80 80" className={className}>
            <path
              d="M 15 10 L 25 5 L 70 50 L 75 60 L 70 70 L 60 75 L 15 30 L 10 20 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 18 14 L 25 10 L 66 51 L 70 58 L 66 66 L 58 70 L 17 29 L 14 22 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse
              cx="42"
              cy="42"
              rx="7"
              ry="5"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(45 42 42)"
            />
            <rect x="40" y="35" width="4" height="5" fill="#1f2937" rx="1" transform="rotate(45 42 42)" />
            <circle cx="28" cy="28" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="56" cy="56" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else {
        const gridSize = size * 2
        return (
          <svg width={gridSize} height={gridSize} viewBox="0 0 80 80" className={className}>
            <path
              d="M 15 70 L 25 75 L 70 30 L 75 20 L 70 10 L 60 5 L 15 50 L 10 60 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 18 66 L 25 70 L 66 29 L 70 22 L 66 14 L 58 10 L 17 51 L 14 58 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse
              cx="42"
              cy="42"
              rx="7"
              ry="5"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(-45 42 42)"
            />
            <rect x="40" y="35" width="4" height="5" fill="#1f2937" rx="1" transform="rotate(-45 42 42)" />
            <circle cx="28" cy="56" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="56" cy="28" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      }
    } else {
      // Battleship SVG paths
      if (orientation === "horizontal") {
        return (
          <svg width={size * 5} height={size} viewBox="0 0 200 40" className={className}>
            <path
              d="M 5 20 L 25 5 L 175 5 L 195 20 L 175 35 L 25 35 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 10 20 L 27 10 L 173 10 L 190 20 L 173 30 L 27 30 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse cx="50" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="47" y="10" width="6" height="8" fill="#1f2937" rx="1" />
            <ellipse cx="80" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="77" y="10" width="6" height="8" fill="#1f2937" rx="1" />
            <rect x="95" y="15" width="10" height="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" rx="1" />
            <ellipse cx="120" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="117" y="10" width="6" height="8" fill="#1f2937" rx="1" />
            <ellipse cx="150" cy="20" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="147" y="10" width="6" height="8" fill="#1f2937" rx="1" />
            <circle cx="35" cy="20" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="165" cy="20" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else if (orientation === "vertical") {
        return (
          <svg width={size} height={size * 5} viewBox="0 0 40 200" className={className}>
            <path
              d="M 20 5 L 35 25 L 35 175 L 20 195 L 5 175 L 5 25 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 20 10 L 30 27 L 30 173 L 20 190 L 10 173 L 10 27 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse cx="20" cy="50" rx="8" ry="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="10" y="47" width="8" height="6" fill="#1f2937" rx="1" />
            <ellipse cx="20" cy="80" rx="8" ry="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="10" y="77" width="8" height="6" fill="#1f2937" rx="1" />
            <rect x="15" y="95" width="10" height="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" rx="1" />
            <ellipse cx="20" cy="120" rx="8" ry="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="10" y="117" width="8" height="6" fill="#1f2937" rx="1" />
            <ellipse cx="20" cy="150" rx="8" ry="10" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="10" y="147" width="8" height="6" fill="#1f2937" rx="1" />
            <circle cx="20" cy="35" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="20" cy="165" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else if (orientation === "diagonal-down") {
        const gridSize = size * 5
        return (
          <svg width={gridSize} height={gridSize} viewBox="0 0 200 200" className={className}>
            <path
              d="M 15 10 L 30 5 L 190 167 L 195 182 L 190 190 L 175 195 L 13 33 L 5 18 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 18 14 L 30 10 L 186 166 L 190 178 L 186 186 L 174 190 L 18 34 L 10 22 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(45 50 50)"
            />
            <rect x="47" y="42" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(45 50 50)" />
            <ellipse
              cx="80"
              cy="80"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(45 80 80)"
            />
            <rect x="77" y="72" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(45 80 80)" />
            <rect
              x="95"
              y="95"
              width="10"
              height="10"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              rx="1"
              transform="rotate(45 100 100)"
            />
            <ellipse
              cx="120"
              cy="120"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(45 120 120)"
            />
            <rect x="117" y="112" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(45 120 120)" />
            <ellipse
              cx="150"
              cy="150"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(45 150 150)"
            />
            <rect x="147" y="142" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(45 150 150)" />
            <circle cx="32" cy="32" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="168" cy="168" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      } else {
        const gridSize = size * 5
        return (
          <svg width={gridSize} height={gridSize} viewBox="0 0 200 200" className={className}>
            <path
              d="M 15 190 L 30 195 L 190 33 L 195 18 L 190 10 L 175 5 L 13 167 L 5 182 Z"
              fill="#6b7280"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <path
              d="M 18 186 L 30 190 L 186 34 L 190 22 L 186 14 L 174 10 L 18 166 L 10 178 Z"
              fill="#4b5563"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse
              cx="50"
              cy="150"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(-45 50 150)"
            />
            <rect x="47" y="142" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(-45 50 150)" />
            <ellipse
              cx="80"
              cy="120"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(-45 80 120)"
            />
            <rect x="77" y="112" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(-45 80 120)" />
            <rect
              x="95"
              y="95"
              width="10"
              height="10"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              rx="1"
              transform="rotate(-45 100 100)"
            />
            <ellipse
              cx="120"
              cy="80"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(-45 120 80)"
            />
            <rect x="117" y="72" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(-45 120 80)" />
            <ellipse
              cx="150"
              cy="50"
              rx="9"
              ry="7"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="1.5"
              transform="rotate(-45 150 50)"
            />
            <rect x="147" y="42" width="6" height="7" fill="#1f2937" rx="1" transform="rotate(-45 150 50)" />
            <circle cx="32" cy="168" r="2" fill="#1f2937" opacity="0.6" />
            <circle cx="168" cy="32" r="2" fill="#1f2937" opacity="0.6" />
          </svg>
        )
      }
    }
  }

  return <div className="flex items-center justify-center">{renderShip()}</div>
}
