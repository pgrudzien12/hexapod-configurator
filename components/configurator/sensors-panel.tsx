"use client"

import { useState } from "react"
import { ConfigCard } from "./config-card"
import { Compass, Gauge, Hand, CheckCircle2, AlertCircle } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { IMUVisualization } from "./imu-visualization"

export function SensorsPanel() {
  const { config, updateConfig } = useConfig()
  const sensors = config.sensors
  const [isCalibrating, setIsCalibrating] = useState(false)

  const handleCalibrate = () => {
    setIsCalibrating(true)
    setTimeout(() => {
      updateConfig("sensors.imu.calibrated", true)
      updateConfig("sensors.imu.offsets", { x: 0.02, y: -0.01, z: 0.03 })
      setIsCalibrating(false)
    }, 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* IMU Configuration */}
      <div className="space-y-6">
        <ConfigCard title="IMU Calibration" icon={Compass} description="Accelerometer and gyroscope">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              {sensors.imu.calibrated ? (
                <>
                  <CheckCircle2 className="size-5 text-success" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Calibrated</div>
                    <div className="text-xs text-muted-foreground">IMU is ready to use</div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="size-5 text-warning" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Not Calibrated</div>
                    <div className="text-xs text-muted-foreground">Calibration required</div>
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleCalibrate} disabled={isCalibrating} className="w-full">
              {isCalibrating ? "Calibrating..." : "Start Calibration"}
            </Button>

            {sensors.imu.calibrated && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs uppercase text-muted-foreground mb-2">Offsets</div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="text-muted-foreground">X</div>
                    <div>{sensors.imu.offsets.x.toFixed(3)}</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="text-muted-foreground">Y</div>
                    <div>{sensors.imu.offsets.y.toFixed(3)}</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <div className="text-muted-foreground">Z</div>
                    <div>{sensors.imu.offsets.z.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ConfigCard>

        <ConfigCard title="Touch Sensors" icon={Hand}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="touch-enabled" className="text-sm font-medium">
                Enable Touch Sensors
              </Label>
              <Switch
                id="touch-enabled"
                checked={sensors.touchSensors.enabled}
                onCheckedChange={(checked) => updateConfig("sensors.touchSensors.enabled", checked)}
              />
            </div>

            {sensors.touchSensors.enabled && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs uppercase">Detection Threshold</Label>
                    <span className="text-xs font-mono text-muted-foreground">{sensors.touchSensors.threshold}</span>
                  </div>
                  <Slider
                    value={[sensors.touchSensors.threshold]}
                    onValueChange={([value]) => updateConfig("sensors.touchSensors.threshold", value)}
                    min={100}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Sensitive</span>
                    <span>Less Sensitive</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-xs uppercase text-muted-foreground mb-2">Sensor Status</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((sensor) => (
                      <div key={sensor} className="p-2 bg-muted/50 rounded text-center">
                        <div className="text-xs text-muted-foreground mb-1">Leg {sensor}</div>
                        <div className="size-3 rounded-full bg-success mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ConfigCard>

        <ConfigCard title="Calibration Steps">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                1
              </div>
              <p className="text-muted-foreground">Place hexapod on a flat, level surface</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                2
              </div>
              <p className="text-muted-foreground">Keep the robot completely still during calibration</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                3
              </div>
              <p className="text-muted-foreground">Click "Start Calibration" and wait for completion</p>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* Real-time Sensor Data */}
      <div className="space-y-6">
        <ConfigCard title="IMU Orientation" description="Real-time visualization">
          <IMUVisualization calibrated={sensors.imu.calibrated} />
        </ConfigCard>

        <ConfigCard title="Sensor Readings" icon={Gauge}>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase text-muted-foreground mb-2">Accelerometer (g)</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">X</div>
                  <div className="text-base">0.02</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Y</div>
                  <div className="text-base">-0.01</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Z</div>
                  <div className="text-base">9.81</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-muted-foreground mb-2">Gyroscope (deg/s)</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">X</div>
                  <div className="text-base">0.5</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Y</div>
                  <div className="text-base">-0.3</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Z</div>
                  <div className="text-base">0.1</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-muted-foreground mb-2">Orientation (deg)</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Roll</div>
                  <div className="text-base">1.2</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Pitch</div>
                  <div className="text-base">-0.8</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-muted-foreground mb-1">Yaw</div>
                  <div className="text-base">45.3</div>
                </div>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
