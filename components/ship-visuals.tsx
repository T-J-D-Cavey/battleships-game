import type { Orientation } from "@/lib/game-types"

interface ShipVisualProps {
  type: "battleship" | "destroyer"
  orientation: Orientation
  size?: number
  className?: string
}

export function ShipVisual({ type, orientation, size = 40, className }: ShipVisualProps) {
  const shipLength = type === "battleship" ? 5 : 2

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
        const diagonalSize = size * Math.sqrt(2) * 2
        return (
          <svg width={diagonalSize} height={diagonalSize} viewBox="0 0 113 113" className={className}>
            <g transform="rotate(45 28.25 28.25) translate(-28.25 -28.25)">
              <path
                d="M 16.5 28.25 L 31.5 13.25 L 71.5 13.25 L 86.5 28.25 L 71.5 43.25 L 31.5 43.25 Z"
                fill="#6b7280"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <path
                d="M 21.5 28.25 L 33.5 18.25 L 69.5 18.25 L 81.5 28.25 L 69.5 38.25 L 33.5 38.25 Z"
                fill="#4b5563"
                stroke="#374151"
                strokeWidth="1"
              />
              <ellipse cx="51.5" cy="28.25" rx="8" ry="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <rect x="49.5" y="20.25" width="4" height="6" fill="#1f2937" rx="1" />
            </g>
          </svg>
        )
      } else {
        // diagonal-up
        const diagonalSize = size * Math.sqrt(2) * 2
        return (
          <svg width={diagonalSize} height={diagonalSize} viewBox="0 0 113 113" className={className}>
            <g transform="rotate(-45 28.25 84.75) translate(-28.25 -84.75)">
              <path
                d="M 16.5 84.75 L 31.5 69.75 L 71.5 69.75 L 86.5 84.75 L 71.5 99.75 L 31.5 99.75 Z"
                fill="#6b7280"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <path
                d="M 21.5 84.75 L 33.5 74.75 L 69.5 74.75 L 81.5 84.75 L 69.5 94.75 L 33.5 94.75 Z"
                fill="#4b5563"
                stroke="#374151"
                strokeWidth="1"
              />
              <ellipse cx="51.5" cy="84.75" rx="8" ry="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <rect x="49.5" y="76.75" width="4" height="6" fill="#1f2937" rx="1" />
            </g>
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
        const diagonalSize = size * Math.sqrt(2) * 5
        return (
          <svg width={diagonalSize} height={diagonalSize} viewBox="0 0 283 283" className={className}>
            <g transform="rotate(45 70.75 70.75) translate(-70.75 -70.75)">
              <path
                d="M 41.5 70.75 L 61.5 50.75 L 221.5 50.75 L 241.5 70.75 L 221.5 90.75 L 61.5 90.75 Z"
                fill="#6b7280"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <path
                d="M 46.5 70.75 L 63.5 55.75 L 219.5 55.75 L 236.5 70.75 L 219.5 85.75 L 63.5 85.75 Z"
                fill="#4b5563"
                stroke="#374151"
                strokeWidth="1"
              />
              <ellipse cx="86.5" cy="70.75" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <ellipse cx="116.5" cy="70.75" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <rect
                x="131.5"
                y="65.75"
                width="10"
                height="10"
                fill="#374151"
                stroke="#1f2937"
                strokeWidth="1.5"
                rx="1"
              />
              <ellipse cx="156.5" cy="70.75" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <ellipse cx="186.5" cy="70.75" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            </g>
          </svg>
        )
      } else {
        // diagonal-up
        const diagonalSize = size * Math.sqrt(2) * 5
        return (
          <svg width={diagonalSize} height={diagonalSize} viewBox="0 0 283 283" className={className}>
            <g transform="rotate(-45 70.75 212.25) translate(-70.75 -212.25)">
              <path
                d="M 41.5 212.25 L 61.5 192.25 L 221.5 192.25 L 241.5 212.25 L 221.5 232.25 L 61.5 232.25 Z"
                fill="#6b7280"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <path
                d="M 46.5 212.25 L 63.5 197.25 L 219.5 197.25 L 236.5 212.25 L 219.5 227.25 L 63.5 227.25 Z"
                fill="#4b5563"
                stroke="#374151"
                strokeWidth="1"
              />
              <ellipse cx="86.5" cy="212.25" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <ellipse cx="116.5" cy="212.25" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <rect
                x="131.5"
                y="207.25"
                width="10"
                height="10"
                fill="#374151"
                stroke="#1f2937"
                strokeWidth="1.5"
                rx="1"
              />
              <ellipse cx="156.5" cy="212.25" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
              <ellipse cx="186.5" cy="212.25" rx="10" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
            </g>
          </svg>
        )
      }
    }
  }

  return <div className="flex items-center justify-center">{renderShip()}</div>
}
