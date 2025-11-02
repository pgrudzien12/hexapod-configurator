"use client"

import { useEffect, useRef, useState } from "react"

interface IMUVisualizationProps {
  calibrated: boolean
}

export function IMUVisualization({ calibrated }: IMUVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ roll: 0, pitch: 0, yaw: 0 })

  useEffect(() => {
    // Simulate IMU data
    const interval = setInterval(() => {
      if (calibrated) {
        setRotation({
          roll: Math.sin(Date.now() / 1000) * 15,
          pitch: Math.cos(Date.now() / 1500) * 10,
          yaw: (Date.now() / 50) % 360,
        })
      }
    }, 50)

    return () => clearInterval(interval)
  }, [calibrated])

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

    if (!calibrated) {
      // Show "not calibrated" message
      ctx.fillStyle = "#6b7280"
      ctx.font = "14px monospace"
      ctx.textAlign = "center"
      ctx.fillText("IMU NOT CALIBRATED", centerX, centerY)
      return
    }

    // Draw horizon line (pitch indicator)
    const horizonY = centerY + rotation.pitch * 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation.roll * Math.PI) / 180)

    // Sky
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(-rect.width, -rect.height, rect.width * 2, horizonY)

    // Ground
    ctx.fillStyle = "#78350f"
    ctx.fillRect(-rect.width, horizonY - centerY, rect.width * 2, rect.height)

    // Horizon line
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-rect.width, horizonY - centerY)
    ctx.lineTo(rect.width, horizonY - centerY)
    ctx.stroke()

    ctx.restore()

    // Draw center crosshair
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX - 30, centerY)
    ctx.lineTo(centerX - 10, centerY)
    ctx.moveTo(centerX + 10, centerY)
    ctx.lineTo(centerX + 30, centerY)
    ctx.moveTo(centerX, centerY - 30)
    ctx.lineTo(centerX, centerY - 10)
    ctx.moveTo(centerX, centerY + 10)
    ctx.lineTo(centerX, centerY + 30)
    ctx.stroke()

    // Draw roll indicator
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
    ctx.stroke()

    // Roll marker
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation.roll * Math.PI) / 180)
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.moveTo(0, -80)
    ctx.lineTo(-5, -70)
    ctx.lineTo(5, -70)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // Draw values
    ctx.fillStyle = "#9ca3af"
    ctx.font = "11px monospace"
    ctx.textAlign = "left"
    ctx.fillText(`Roll: ${rotation.roll.toFixed(1)}°`, 10, 20)
    ctx.fillText(`Pitch: ${rotation.pitch.toFixed(1)}°`, 10, 35)
    ctx.fillText(`Yaw: ${rotation.yaw.toFixed(1)}°`, 10, 50)
  }, [rotation, calibrated])

  return <canvas ref={canvasRef} className="w-full h-[300px] bg-muted/30 rounded-lg" />
}
