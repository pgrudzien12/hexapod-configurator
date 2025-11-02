"use client"

import { useEffect, useRef, useState } from "react"

export function HexapodVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 0.5) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

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

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Apply rotation
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    // Draw hexapod body (top view with perspective)
    const bodyRadius = 50

    // Body shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.beginPath()
    ctx.ellipse(5, 5, bodyRadius, bodyRadius * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()

    // Main body
    ctx.fillStyle = "#374151"
    ctx.strokeStyle = "#4b5563"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(0, 0, bodyRadius, bodyRadius * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Draw legs (6 legs in hexagon pattern)
    const legAngles = [30, 90, 150, 210, 270, 330]
    const legLength = 60

    legAngles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180
      const startX = Math.cos(rad) * bodyRadius * 0.8
      const startY = Math.sin(rad) * bodyRadius * 0.6 * 0.8

      // Leg segments with perspective
      const midX = Math.cos(rad) * (bodyRadius + legLength * 0.5)
      const midY = Math.sin(rad) * (bodyRadius * 0.6 + legLength * 0.3)

      const endX = Math.cos(rad) * (bodyRadius + legLength)
      const endY = Math.sin(rad) * (bodyRadius * 0.6 + legLength * 0.5)

      // Draw leg
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 4
      ctx.lineCap = "round"

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(midX, midY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Draw joints
      ctx.fillStyle = "#6b7280"
      ctx.beginPath()
      ctx.arc(startX, startY, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(midX, midY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw foot
      ctx.fillStyle = "#8b5cf6"
      ctx.beginPath()
      ctx.arc(endX, endY, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw center indicator
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(0, 0, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw direction indicator
    ctx.strokeStyle = "#a78bfa"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -bodyRadius * 0.4)
    ctx.stroke()

    ctx.restore()

    // Draw labels
    ctx.fillStyle = "#9ca3af"
    ctx.font = "11px monospace"
    ctx.textAlign = "center"
    ctx.fillText("3D VIEW", centerX, 20)
    ctx.fillText(`${rotation.toFixed(0)}°`, centerX, rect.height - 10)
  }, [rotation])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-[350px] bg-muted/30 rounded-lg" />
      <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-mono">
        LIVE
      </div>
    </div>
  )
}
