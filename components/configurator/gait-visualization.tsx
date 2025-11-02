"use client"

import { useEffect, useRef, useState } from "react"

interface GaitVisualizationProps {
  gaitType: "tripod" | "wave" | "ripple"
  speed: number
}

export function GaitVisualization({ gaitType, speed }: GaitVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Hexapod body (simplified top view)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const bodyRadius = 40

    // Draw body
    ctx.fillStyle = "#374151"
    ctx.beginPath()
    ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2)
    ctx.fill()

    // Leg positions (6 legs in hexagon pattern)
    const legAngles = [0, 60, 120, 180, 240, 300]
    const legLength = 50

    // Gait patterns define which legs are up/down at each phase
    const gaitPatterns: Record<string, number[][]> = {
      tripod: [
        [1, 0, 1, 0, 1, 0], // Phase 0: legs 0,2,4 down
        [0, 1, 0, 1, 0, 1], // Phase 1: legs 1,3,5 down
      ],
      wave: [
        [1, 0, 0, 0, 0, 0], // Each leg moves in sequence
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1],
      ],
      ripple: [
        [1, 0, 0, 1, 0, 0], // Ripple pattern
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1],
      ],
    }

    const pattern = gaitPatterns[gaitType]
    const phaseIndex = Math.floor(frame / 30) % pattern.length
    const currentPhase = pattern[phaseIndex]

    // Draw legs
    legAngles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180
      const legX = centerX + Math.cos(rad) * (bodyRadius + legLength)
      const legY = centerY + Math.sin(rad) * (bodyRadius + legLength)

      const isDown = currentPhase[i] === 1

      // Draw leg line
      ctx.strokeStyle = isDown ? "#8b5cf6" : "#6b7280"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(rad) * bodyRadius, centerY + Math.sin(rad) * bodyRadius)
      ctx.lineTo(legX, legY)
      ctx.stroke()

      // Draw leg tip
      ctx.fillStyle = isDown ? "#8b5cf6" : "#6b7280"
      ctx.beginPath()
      ctx.arc(legX, legY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw leg number
      ctx.fillStyle = "#9ca3af"
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`${i + 1}`, legX, legY - 12)
    })

    // Draw center indicator
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw legend
    ctx.fillStyle = "#9ca3af"
    ctx.font = "11px monospace"
    ctx.textAlign = "left"
    ctx.fillText("Purple = Stance (down)", 10, rect.height - 30)
    ctx.fillText("Gray = Swing (up)", 10, rect.height - 15)
  }, [gaitType, frame])

  useEffect(() => {
    // Animation loop
    const interval = setInterval(
      () => {
        setFrame((f) => f + 1)
      },
      Math.max(50, 200 - speed * 1.5),
    ) // Speed affects animation rate

    return () => clearInterval(interval)
  }, [speed])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-[350px] bg-muted/30 rounded-lg" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-mono uppercase">
        {gaitType} Gait
      </div>
    </div>
  )
}
