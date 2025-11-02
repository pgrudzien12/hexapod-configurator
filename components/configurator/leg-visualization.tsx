"use client"

import { useEffect, useRef } from "react"

interface ServoConfig {
  min: number
  max: number
  center: number
  reversed: boolean
}

interface LegVisualizationProps {
  legId: string
  legName: string
  servos: {
    coxa: ServoConfig
    femur: ServoConfig
    tibia: ServoConfig
  }
  testingServo: string | null
}

export function LegVisualization({ legId, legName, servos, testingServo }: LegVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate angles from servo positions (simplified)
    const coxaAngle = (((servos.coxa.center - 1500) / 1000) * Math.PI) / 2
    const femurAngle = (((servos.femur.center - 1500) / 1000) * Math.PI) / 2
    const tibiaAngle = (((servos.tibia.center - 1500) / 1000) * Math.PI) / 2

    // Leg segment lengths
    const coxaLength = 40
    const femurLength = 80
    const tibiaLength = 100

    // Starting position (center of canvas)
    const startX = rect.width / 2
    const startY = rect.height / 3

    // Calculate joint positions
    const coxa = {
      x: startX + Math.cos(coxaAngle) * coxaLength,
      y: startY + Math.sin(coxaAngle) * coxaLength,
    }

    const femur = {
      x: coxa.x + Math.cos(coxaAngle + femurAngle) * femurLength,
      y: coxa.y + Math.sin(coxaAngle + femurAngle) * femurLength,
    }

    const tibia = {
      x: femur.x + Math.cos(coxaAngle + femurAngle + tibiaAngle) * tibiaLength,
      y: femur.y + Math.sin(coxaAngle + femurAngle + tibiaAngle) * tibiaLength,
    }

    // Draw leg segments
    ctx.lineWidth = 6
    ctx.lineCap = "round"

    // Coxa segment
    ctx.strokeStyle = testingServo === "coxa" ? "#8b5cf6" : "#6b7280"
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(coxa.x, coxa.y)
    ctx.stroke()

    // Femur segment
    ctx.strokeStyle = testingServo === "femur" ? "#8b5cf6" : "#6b7280"
    ctx.beginPath()
    ctx.moveTo(coxa.x, coxa.y)
    ctx.lineTo(femur.x, femur.y)
    ctx.stroke()

    // Tibia segment
    ctx.strokeStyle = testingServo === "tibia" ? "#8b5cf6" : "#6b7280"
    ctx.beginPath()
    ctx.moveTo(femur.x, femur.y)
    ctx.lineTo(tibia.x, tibia.y)
    ctx.stroke()

    // Draw joints
    const drawJoint = (x: number, y: number, active: boolean) => {
      ctx.fillStyle = active ? "#8b5cf6" : "#374151"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = active ? "#a78bfa" : "#4b5563"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    drawJoint(startX, startY, false)
    drawJoint(coxa.x, coxa.y, testingServo === "coxa")
    drawJoint(femur.x, femur.y, testingServo === "femur")
    drawJoint(tibia.x, tibia.y, testingServo === "tibia")

    // Draw foot
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(tibia.x, tibia.y, 6, 0, Math.PI * 2)
    ctx.fill()

    // Draw labels
    ctx.fillStyle = "#9ca3af"
    ctx.font = "10px monospace"
    ctx.textAlign = "center"
    ctx.fillText("COXA", startX, startY - 15)
    ctx.fillText("FEMUR", coxa.x, coxa.y - 15)
    ctx.fillText("TIBIA", femur.x, femur.y - 15)
  }, [servos, testingServo])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-[300px] bg-muted/30 rounded-lg" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-mono">
        {legName}
      </div>
    </div>
  )
}
