"use client"

import { useState } from "react"
import { ConfigCard } from "./config-card"
import { Gamepad2, Radio, Wifi, Activity } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const CONTROLLER_TYPES = [
  {
    id: "flysky" as const,
    name: "FlySky",
    description: "Traditional RC receiver (iBUS protocol)",
    icon: Radio,
  },
  {
    id: "espnow" as const,
    name: "ESP-NOW",
    description: "Direct ESP32 to ESP32 communication",
    icon: Wifi,
  },
]

const CHANNEL_MAPPINGS = [
  { id: 0, name: "Forward/Backward", defaultValue: 1500 },
  { id: 1, name: "Left/Right", defaultValue: 1500 },
  { id: 2, name: "Rotation", defaultValue: 1500 },
  { id: 3, name: "Body Height", defaultValue: 1500 },
  { id: 4, name: "Speed Control", defaultValue: 1000 },
  { id: 5, name: "Gait Select", defaultValue: 1000 },
]

export function ControllerSettingsPanel() {
  const { config, updateConfig } = useConfig()
  const controller = config.controller
  const [channelValues, setChannelValues] = useState<Record<number, number>>(
    CHANNEL_MAPPINGS.reduce((acc, ch) => ({ ...acc, [ch.id]: ch.defaultValue }), {}),
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controller Type Selection */}
      <div className="space-y-6">
        <ConfigCard title="Controller Type" icon={Gamepad2}>
          <div className="space-y-3">
            {CONTROLLER_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => updateConfig("controller.type", type.id)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3",
                    controller.type === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center size-10 rounded-lg shrink-0",
                      controller.type === type.id ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-base uppercase mb-1 font-mono">{type.name}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </ConfigCard>

        <ConfigCard title="Deadzone" description="Stick center tolerance">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs uppercase">Deadzone</Label>
              <span className="text-xs font-mono text-muted-foreground">{controller.deadzone}μs</span>
            </div>
            <Slider
              value={[controller.deadzone]}
              onValueChange={([value]) => updateConfig("controller.deadzone", value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Prevents drift from stick center position</p>
          </div>
        </ConfigCard>

        <ConfigCard title="Calibration">
          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent">
              Start Calibration Wizard
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                Reset to Defaults
              </Button>
              <Button variant="outline" size="sm">
                Test Inputs
              </Button>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* Channel Mapping and Monitoring */}
      <div className="space-y-6">
        <ConfigCard title="Channel Mapping" icon={Activity} description="Real-time input monitoring">
          <div className="space-y-4">
            {CHANNEL_MAPPINGS.map((channel) => (
              <div key={channel.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase">
                    CH{channel.id + 1}: {channel.name}
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">{channelValues[channel.id]}μs</span>
                </div>
                <div className="relative">
                  <Progress value={((channelValues[channel.id] - 1000) / 1000) * 100} className="h-2" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-0.5 h-3 bg-foreground/30" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1000</span>
                  <span>1500</span>
                  <span>2000</span>
                </div>
              </div>
            ))}
          </div>
        </ConfigCard>

        <ConfigCard title="Connection Status">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <span className="text-sm">Signal Strength</span>
              <span className="text-sm font-mono">-45 dBm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <span className="text-sm">Packet Loss</span>
              <span className="text-sm font-mono">0.2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <span className="text-sm">Update Rate</span>
              <span className="text-sm font-mono">50 Hz</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <span className="text-sm">Failsafe</span>
              <span className="text-sm font-mono text-success">Active</span>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
