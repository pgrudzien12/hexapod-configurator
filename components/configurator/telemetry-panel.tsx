"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ConfigCard } from "./config-card"
import { Activity, Cpu, Thermometer, Zap, AlertCircle } from "lucide-react"
import { HexapodVisualization } from "./hexapod-visualization"
import { Progress } from "@/components/ui/progress"

interface TelemetryData {
  cpuUsage: number
  temperature: number
  voltage: number
  current: number
  loopTime: number
  servoLoad: number[]
}

export function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    cpuUsage: 45,
    temperature: 42,
    voltage: 7.4,
    current: 1.2,
    loopTime: 18,
    servoLoad: [65, 72, 58, 68, 70, 63],
  })

  useEffect(() => {
    // Simulate telemetry updates
    const interval = setInterval(() => {
      setTelemetry({
        cpuUsage: 40 + Math.random() * 20,
        temperature: 40 + Math.random() * 10,
        voltage: 7.2 + Math.random() * 0.4,
        current: 1.0 + Math.random() * 0.5,
        loopTime: 15 + Math.random() * 10,
        servoLoad: Array.from({ length: 6 }, () => 50 + Math.random() * 40),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return "text-destructive"
    if (value >= thresholds.warning) return "text-warning"
    return "text-success"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Hexapod Visualization */}
      <div className="space-y-6">
        <ConfigCard title="Robot Visualization" description="Real-time 3D view">
          <HexapodVisualization />
        </ConfigCard>

        <ConfigCard title="System Health" icon={Activity}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-muted-foreground" />
                  <Label className="text-xs uppercase">CPU Usage</Label>
                </div>
                <span
                  className={`text-sm font-mono ${getStatusColor(telemetry.cpuUsage, { warning: 70, danger: 90 })}`}
                >
                  {telemetry.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <Progress value={telemetry.cpuUsage} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-4 text-muted-foreground" />
                  <Label className="text-xs uppercase">Temperature</Label>
                </div>
                <span
                  className={`text-sm font-mono ${getStatusColor(telemetry.temperature, { warning: 60, danger: 75 })}`}
                >
                  {telemetry.temperature.toFixed(1)}°C
                </span>
              </div>
              <Progress value={(telemetry.temperature / 85) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-muted-foreground" />
                  <Label className="text-xs uppercase">Loop Time</Label>
                </div>
                <span
                  className={`text-sm font-mono ${getStatusColor(telemetry.loopTime, { warning: 25, danger: 35 })}`}
                >
                  {telemetry.loopTime.toFixed(1)}ms
                </span>
              </div>
              <Progress value={(telemetry.loopTime / 50) * 100} className="h-2" />
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-6">
        <ConfigCard title="Power Metrics" icon={Zap}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Voltage</div>
              <div className="text-2xl font-display">{telemetry.voltage.toFixed(2)}V</div>
              <div className="text-xs text-muted-foreground mt-1">Battery</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Current</div>
              <div className="text-2xl font-display">{telemetry.current.toFixed(2)}A</div>
              <div className="text-xs text-muted-foreground mt-1">Draw</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Power</div>
              <div className="text-2xl font-display">{(telemetry.voltage * telemetry.current).toFixed(1)}W</div>
              <div className="text-xs text-muted-foreground mt-1">Consumption</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
              <div className="text-2xl font-display">87%</div>
              <div className="text-xs text-muted-foreground mt-1">Rating</div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Servo Load" description="Individual leg servo stress">
          <div className="space-y-3">
            {telemetry.servoLoad.map((load, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase">Leg {index + 1}</span>
                  <span className={`text-xs font-mono ${getStatusColor(load, { warning: 75, danger: 90 })}`}>
                    {load.toFixed(0)}%
                  </span>
                </div>
                <Progress value={load} className="h-2" />
              </div>
            ))}
          </div>
        </ConfigCard>

        <ConfigCard title="System Alerts" icon={AlertCircle}>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-success/10 border border-success/20 rounded text-xs">
              <div className="size-2 rounded-full bg-success mt-1 shrink-0" />
              <div>
                <div className="font-medium">All systems operational</div>
                <div className="text-muted-foreground">No warnings or errors detected</div>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Performance Stats">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-muted-foreground mb-1">Packets/sec</div>
              <div className="font-mono text-base">50</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-muted-foreground mb-1">Latency</div>
              <div className="font-mono text-base">12ms</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-muted-foreground mb-1">Dropped</div>
              <div className="font-mono text-base">0</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-muted-foreground mb-1">Uptime</div>
              <div className="font-mono text-base">2h 34m</div>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>
}
