"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Skull, RotateCcw, Home, Crosshair, Target } from "lucide-react"
import { loadGameState, clearGameState } from "@/lib/storage"

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<"victory" | "defeat" | null>(null)
  const [playerHits, setPlayerHits] = useState(0)
  const [enemyHits, setEnemyHits] = useState(0)

  useEffect(() => {
    const savedState = loadGameState()

    if (!savedState.gameResult) {
      router.push("/")
      return
    }

    setResult(savedState.gameResult)
    setPlayerHits(savedState.playerHits || 0)
    setEnemyHits(savedState.enemyHits || 0)
  }, [router])

  const handlePlayAgain = () => {
    clearGameState()
    router.push("/position-ships")
  }

  const handleMainMenu = () => {
    clearGameState()
    router.push("/")
  }

  if (!result) {
    return (
      <div className="min-h-screen ocean-texture flex items-center justify-center">
        <div className="text-radar-glow font-mono">LOADING RESULTS...</div>
      </div>
    )
  }

  const isVictory = result === "victory"

  return (
    <div className="min-h-screen ocean-texture flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {isVictory ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-radar-glow/10 blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-radar-glow/10 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-destructive/10 blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-destructive/10 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </>
        )}
      </div>

      <Card className="metallic-panel max-w-2xl w-full p-8 md:p-12 relative overflow-hidden">
        {/* Corner decorations */}
        <div
          className={`absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 ${isVictory ? "border-radar-glow" : "border-destructive"} opacity-70`}
        />
        <div
          className={`absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 ${isVictory ? "border-radar-glow" : "border-destructive"} opacity-70`}
        />
        <div
          className={`absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 ${isVictory ? "border-radar-glow" : "border-destructive"} opacity-70`}
        />
        <div
          className={`absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 ${isVictory ? "border-radar-glow" : "border-destructive"} opacity-70`}
        />

        <div className="relative z-10">
          {/* Result Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              {isVictory ? (
                <Trophy className="w-24 h-24 text-radar-glow animate-pulse" />
              ) : (
                <Skull className="w-24 h-24 text-destructive animate-pulse" />
              )}
            </div>

            <h1
              className={`text-6xl md:text-8xl font-bold tracking-wider mb-4 ${isVictory ? "text-radar-glow" : "text-destructive"}`}
              style={{
                textShadow: isVictory
                  ? "0 0 20px oklch(0.6 0.2 180), 0 0 40px oklch(0.6 0.2 180)"
                  : "0 0 20px oklch(0.55 0.25 25), 0 0 40px oklch(0.55 0.25 25)",
              }}
            >
              {isVictory ? "VICTORY" : "DEFEAT"}
            </h1>

            <p className="text-muted-foreground text-lg tracking-wide font-mono">
              {isVictory ? "MISSION ACCOMPLISHED - ENEMY FLEET DESTROYED" : "MISSION FAILED - FLEET DESTROYED"}
            </p>
          </div>

          {/* Battle Statistics */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="metallic-panel p-6 rounded">
              <div className="flex items-center gap-3 mb-4">
                <Crosshair className="w-6 h-6 text-radar-glow" />
                <h2 className="text-lg font-bold tracking-wide">INFLICTED DAMAGE</h2>
              </div>
              <div className="text-5xl font-bold text-radar-glow font-mono mb-2">{playerHits}</div>
              <div className="text-sm text-muted-foreground">DIRECT HITS TO ENEMY FLEET</div>
            </div>

            <div className="metallic-panel p-6 rounded">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-destructive" />
                <h2 className="text-lg font-bold tracking-wide">DAMAGE SUSTAINED</h2>
              </div>
              <div className="text-5xl font-bold text-destructive font-mono mb-2">{enemyHits}</div>
              <div className="text-sm text-muted-foreground">DIRECT HITS TO OUR FLEET</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-16 text-xl font-bold tracking-wider metallic-panel glow-border hover:brightness-125 transition-all"
              onClick={handlePlayAgain}
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              DEPLOY NEW FLEET
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full h-14 text-lg font-bold tracking-wider metallic-panel border-steel-light hover:border-radar-glow transition-all bg-transparent"
              onClick={handleMainMenu}
            >
              <Home className="w-5 h-5 mr-3" />
              RETURN TO COMMAND
            </Button>
          </div>

          {/* Battle Summary */}
          <div className="mt-8 pt-8 border-t border-steel-light text-center">
            <p className="text-xs text-muted-foreground font-mono">
              {isVictory
                ? "OUTSTANDING TACTICAL PERFORMANCE - ENEMY NEUTRALISED"
                : "REGROUP AND PREPARE FOR NEXT ENGAGEMENT"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
