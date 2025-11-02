"use client"

import { ConfigCard } from "./config-card"
import { Gauge, Zap, ArrowUpDown, Ruler } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { GaitVisualization } from "./gait-visualization"

const GAIT_TYPES = [
  {
    id: "tripod" as const,
    name: "Tripod",
    description: "Fast, stable gait with 3 legs moving at once",
    speed: "Fast",
    stability: "High",
  },
  {
    id: "wave" as const,
    name: "Wave",
    description: "Smooth gait with legs moving in sequence",
    speed: "Medium",
    stability: "Very High",
  },
  {
    id: "ripple" as const,
    name: "Ripple",
    description: "Efficient gait for uneven terrain",
    speed: "Medium",
    stability: "High",
  },
]

export function MotionControlPanel() {
  const { config, updateConfig } = useConfig()
  const motion = config.motion

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gait Selection */}
      <div className="space-y-6">
        <ConfigCard title="Gait Pattern" icon={Gauge} description="Select walking pattern">
          <div className="space-y-3">
            {GAIT_TYPES.map((gait) => (
              <button
                key={gait.id}
                onClick={() => updateConfig("motion.gaitType", gait.id)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-left",
                  motion.gaitType === gait.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display text-base uppercase">{gait.name}</h4>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">{gait.speed}</span>
                    <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">{gait.stability}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{gait.description}</p>
              </button>
            ))}
          </div>
        </ConfigCard>

        <ConfigCard title="Movement Parameters" icon={Zap}>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase flex items-center gap-2">
                  <Zap className="size-4" />
                  Speed
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{motion.speed}%</span>
              </div>
              <Slider
                value={[motion.speed]}
                onValueChange={([value]) => updateConfig("motion.speed", value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase flex items-center gap-2">
                  <ArrowUpDown className="size-4" />
                  Step Height
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{motion.stepHeight}mm</span>
              </div>
              <Slider
                value={[motion.stepHeight]}
                onValueChange={([value]) => updateConfig("motion.stepHeight", value)}
                min={10}
                max={80}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase flex items-center gap-2">
                  <Ruler className="size-4" />
                  Body Height
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{motion.bodyHeight}mm</span>
              </div>
              <Slider
                value={[motion.bodyHeight]}
                onValueChange={([value]) => updateConfig("motion.bodyHeight", value)}
                min={40}
                max={120}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* Gait Visualization */}
      <div className="space-y-6">
        <ConfigCard title="Gait Visualization" description="Real-time pattern preview">
          <GaitVisualization gaitType={motion.gaitType} speed={motion.speed} />
        </ConfigCard>

        <ConfigCard title="Gait Information">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium uppercase mb-2">Current Pattern</h4>
              <p className="text-sm text-muted-foreground">
                {GAIT_TYPES.find((g) => g.id === motion.gaitType)?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Speed</div>
                <div className="text-lg font-display">{motion.speed}%</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Step Height</div>
                <div className="text-lg font-display">{motion.stepHeight}mm</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Body Height</div>
                <div className="text-lg font-display">{motion.bodyHeight}mm</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Gait Type</div>
                <div className="text-lg font-display">{motion.gaitType.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
