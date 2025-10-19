"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Anchor, Crosshair, Shield } from "lucide-react"

export default function LandingPage() {
  const [showRules, setShowRules] = useState(false)

  return (
    <div className="min-h-screen ocean-texture flex items-center justify-center p-4">
      {/* Animated radar scan effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-6 border-radar-glow radar-scan" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-4 border-radar-glow radar-scan"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-radar-glow radar-scan"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Card className="metallic-panel max-w-2xl w-full p-8 md:p-12 relative overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-radar-glow opacity-50" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-radar-glow opacity-50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-radar-glow opacity-50" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-radar-glow opacity-50" />

        <div className="relative z-10">
          {/* Game Title */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Anchor className="w-12 h-12 text-radar-glow" />
              <h1 className="text-4xl md:text-7xl font-bold tracking-wider text-foreground">BATTLESHIPS</h1>
              <Anchor className="w-12 h-12 text-radar-glow" />
            </div>
            <p className="text-muted-foreground text-lg tracking-wide font-mono">COMMANDER OF THE SEAS</p>
          </div>

          <div className="mb-4 rounded-lg overflow-hidden border-2 border-steel-light/30">
            <img
              src="/naval-battle-scene.jpg"
              alt="Naval Battle Scene"
              className="w-full h-48 object-cover opacity-80"
            />
          </div>

          {!showRules ? (
            <div className="space-y-4">
              {/* Main Buttons */}
              <Button
                size="lg"
                className="w-full h-16 text-xl font-bold tracking-wider metallic-panel glow-border hover:brightness-125 transition-all"
                onClick={() => (window.location.href = "/position-ships")}
              >
                <Crosshair className="w-6 h-6 mr-3" />
                DEPLOY FLEET
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg font-bold tracking-wider metallic-panel border-steel-light hover:border-radar-glow transition-all bg-transparent"
                onClick={() => setShowRules(true)}
              >
                <Shield className="w-5 h-5 mr-3" />
                MISSION BRIEFING
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Rules Content */}
              <div className="space-y-4 text-foreground">
                <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
                  <Shield className="w-6 h-6 text-radar-glow" />
                  MISSION BRIEFING
                </h2>

                <div className="space-y-3 text-sm leading-relaxed">
                  <div className="metallic-panel p-4 rounded">
                    <h3 className="font-bold text-radar-glow mb-2">OBJECTIVE</h3>
                    <p>
                      Destroy the enemy's battleship before they destroy yours. Sinking all of your enemy's destroyers
                      will force them to retreat.
                    </p>
                  </div>

                  <div className="metallic-panel p-4 rounded">
                    <h3 className="font-bold text-radar-glow mb-2">YOUR FLEET</h3>
                    <ul className="space-y-1 ml-4">
                      <li>• 1 Battleship (5 tiles)</li>
                      <li>• 5 Destroyers (2 tiles each)</li>
                    </ul>
                  </div>

                  <div className="metallic-panel p-4 rounded">
                    <h3 className="font-bold text-radar-glow mb-2">DEPLOYMENT</h3>
                    <p>
                      Position your ships on the grid. Ships can be placed horizontally or vertically.
                    </p>
                  </div>

                  <div className="metallic-panel p-4 rounded">
                    <h3 className="font-bold text-radar-glow mb-2">COMBAT</h3>
                    <p>
                      Take turns targeting enemy coordinates. Destroyers are destroyed with a single hit. Destroying the
                      enemy battleship results in victory. If all enemy destroyers are destroyed, they retreat and the
                      winner is determined by who inflicted the most damage.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold tracking-wider metallic-panel glow-border hover:brightness-125 transition-all"
                onClick={() => setShowRules(false)}
              >
                RETURN TO COMMAND
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
