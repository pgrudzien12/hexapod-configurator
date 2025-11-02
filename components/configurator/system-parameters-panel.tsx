"use client"

import { ConfigCard } from "./config-card"
import { Settings, Shield, Battery, AlertTriangle, Info } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SystemParametersPanel() {
  const { config, updateConfig } = useConfig()
  const system = config.system

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Safety Settings */}
      <div className="space-y-6">
        <ConfigCard title="Safety Settings" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-primary" />
                <div>
                  <Label htmlFor="safe-mode" className="text-sm font-medium">
                    Safe Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">Limits speed and range of motion</p>
                </div>
              </div>
              <Switch
                id="safe-mode"
                checked={system.safeMode}
                onCheckedChange={(checked) => updateConfig("system.safeMode", checked)}
              />
            </div>

            {system.safeMode && (
              <Alert>
                <Info className="size-4" />
                <AlertDescription className="text-xs">
                  Safe mode is active. Maximum speed is limited to 50% and extreme servo positions are restricted.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase">Maximum Speed Limit</Label>
                <span className="text-xs font-mono text-muted-foreground">{system.maxSpeed}%</span>
              </div>
              <Slider
                value={[system.maxSpeed]}
                onValueChange={([value]) => updateConfig("system.maxSpeed", value)}
                min={10}
                max={100}
                step={5}
                className="w-full"
                disabled={system.safeMode}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Power Management" icon={Battery}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="power-saving" className="text-sm font-medium">
                  Power Saving Mode
                </Label>
                <p className="text-xs text-muted-foreground">Reduces servo holding torque when idle</p>
              </div>
              <Switch
                id="power-saving"
                checked={system.powerSaving}
                onCheckedChange={(checked) => updateConfig("system.powerSaving", checked)}
              />
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">Battery Voltage</span>
                <span className="text-sm font-mono">7.4V</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">Current Draw</span>
                <span className="text-sm font-mono">1.2A</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">Power Consumption</span>
                <span className="text-sm font-mono">8.9W</span>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Failsafe Configuration" icon={AlertTriangle}>
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertDescription className="text-xs">
                Failsafe will activate if controller signal is lost for more than 1 second.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span>Stop all movement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span>Lower body to ground</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span>Disable servos after 5 seconds</span>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* System Information */}
      <div className="space-y-6">
        <ConfigCard title="System Information" icon={Info}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Firmware Version</div>
                <div className="text-sm font-mono">v2.1.3</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Hardware Rev</div>
                <div className="text-sm font-mono">ESP32-S3</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                <div className="text-sm font-mono">2h 34m</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Free Memory</div>
                <div className="text-sm font-mono">124 KB</div>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Motion Limits" icon={Settings}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              These limits prevent mechanical damage and ensure stable operation.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase text-muted-foreground">Max Tilt Angle</span>
                  <span className="text-xs font-mono">30°</span>
                </div>
                <div className="text-xs text-muted-foreground">Maximum body tilt before emergency stop</div>
              </div>

              <div className="p-3 bg-muted/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase text-muted-foreground">Servo Timeout</span>
                  <span className="text-xs font-mono">5000ms</span>
                </div>
                <div className="text-xs text-muted-foreground">Maximum time for servo to reach position</div>
              </div>

              <div className="p-3 bg-muted/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase text-muted-foreground">Update Rate</span>
                  <span className="text-xs font-mono">50 Hz</span>
                </div>
                <div className="text-xs text-muted-foreground">Servo command update frequency</div>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Debug Options" icon={Settings}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-serial" className="text-sm">
                Serial Debug Output
              </Label>
              <Switch id="debug-serial" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-telemetry" className="text-sm">
                Telemetry Logging
              </Label>
              <Switch id="debug-telemetry" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-verbose" className="text-sm">
                Verbose Mode
              </Label>
              <Switch id="debug-verbose" />
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
