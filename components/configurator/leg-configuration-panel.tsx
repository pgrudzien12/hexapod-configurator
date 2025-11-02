"use client"

import { useState } from "react"
import { ConfigCard } from "./config-card"
import { Activity, RotateCw, Play, Square, Ruler } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LegVisualization } from "./leg-visualization"

const LEG_IDS = ["leg-1", "leg-2", "leg-3", "leg-4", "leg-5", "leg-6"]
const LEG_NAMES = ["Front Right", "Middle Right", "Rear Right", "Rear Left", "Middle Left", "Front Left"]
const SERVO_TYPES = ["coxa", "femur", "tibia"] as const
const SERVO_LABELS = { coxa: "Coxa (Hip)", femur: "Femur (Upper)", tibia: "Tibia (Lower)" }

export function LegConfigurationPanel() {
  const { config, updateConfig } = useConfig()
  const [selectedLeg, setSelectedLeg] = useState("leg-1")
  const [testingServo, setTestingServo] = useState<string | null>(null)

  const legConfig = config.legs[selectedLeg]
  const legIndex = LEG_IDS.indexOf(selectedLeg)

  const handleServoUpdate = (servoType: (typeof SERVO_TYPES)[number], param: string, value: number | boolean) => {
    updateConfig(`legs.${selectedLeg}.servos.${servoType}.${param}`, value)
  }

  const handleGeometryUpdate = (param: string, value: number) => {
    updateConfig(`legs.${selectedLeg}.geometry.${param}`, value)
  }

  const handleOffsetUpdate = (param: string, value: number) => {
    updateConfig(`legs.${selectedLeg}.offsets.${param}`, value)
  }

  const handleTestServo = (servoType: string) => {
    setTestingServo(servoType)
    setTimeout(() => setTestingServo(null), 2000)
  }

  const handleCenterAll = () => {
    SERVO_TYPES.forEach((servoType) => {
      handleServoUpdate(servoType, "center", 1500)
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leg Selection and Controls */}
      <div className="space-y-6">
        <ConfigCard title="Select Leg" icon={Activity}>
          <div className="grid grid-cols-2 gap-3">
            {LEG_IDS.map((legId, idx) => (
              <button
                key={legId}
                onClick={() => setSelectedLeg(legId)}
                className={cn(
                  "px-4 py-3 rounded-lg border-2 transition-all text-left",
                  selectedLeg === legId
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div className="font-display text-sm uppercase font-mono">{LEG_NAMES[idx]}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {config.legs[legId].enabled ? "Enabled" : "Disabled"}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <Label htmlFor="leg-enabled" className="text-sm font-medium">
              Enable Leg
            </Label>
            <Switch
              id="leg-enabled"
              checked={legConfig.enabled}
              onCheckedChange={(checked) => updateConfig(`legs.${selectedLeg}.enabled`, checked)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCenterAll} className="flex-1 bg-transparent">
              <RotateCw className="size-4 mr-2" />
              Center All
            </Button>
          </div>
        </ConfigCard>

        {/* Servo Configuration */}
        <ConfigCard title="Servo Configuration" description={`Tuning ${LEG_NAMES[legIndex]}`}>
          <Tabs defaultValue="coxa" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {SERVO_TYPES.map((type) => (
                <TabsTrigger key={type} value={type} className="uppercase text-xs">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            {SERVO_TYPES.map((servoType) => {
              const servo = legConfig.servos[servoType]
              return (
                <TabsContent key={servoType} value={servoType} className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium uppercase">{SERVO_LABELS[servoType]}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestServo(servoType)}
                      disabled={testingServo === servoType}
                    >
                      {testingServo === servoType ? (
                        <>
                          <Square className="size-3 mr-2" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="size-3 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={`${servoType}-pin`} className="text-xs uppercase">
                          GPIO Pin Number
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">Pin {servo.pin}</span>
                      </div>
                      <Input
                        id={`${servoType}-pin`}
                        type="number"
                        min={0}
                        max={39}
                        value={servo.pin}
                        onChange={(e) => handleServoUpdate(servoType, "pin", Number.parseInt(e.target.value) || 0)}
                        className="w-full font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs uppercase">Min Position</Label>
                        <span className="text-xs font-mono text-muted-foreground">{servo.min}μs</span>
                      </div>
                      <Slider
                        value={[servo.min]}
                        onValueChange={([value]) => handleServoUpdate(servoType, "min", value)}
                        min={500}
                        max={2500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs uppercase">Center Position</Label>
                        <span className="text-xs font-mono text-muted-foreground">{servo.center}μs</span>
                      </div>
                      <Slider
                        value={[servo.center]}
                        onValueChange={([value]) => handleServoUpdate(servoType, "center", value)}
                        min={500}
                        max={2500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs uppercase">Max Position</Label>
                        <span className="text-xs font-mono text-muted-foreground">{servo.max}μs</span>
                      </div>
                      <Slider
                        value={[servo.max]}
                        onValueChange={([value]) => handleServoUpdate(servoType, "max", value)}
                        min={500}
                        max={2500}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Label htmlFor={`${servoType}-reversed`} className="text-xs uppercase">
                        Reverse Direction
                      </Label>
                      <Switch
                        id={`${servoType}-reversed`}
                        checked={servo.reversed}
                        onCheckedChange={(checked) => handleServoUpdate(servoType, "reversed", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </ConfigCard>

        {/* Leg Geometry & Offsets */}
        <ConfigCard title="Leg Geometry & Offsets" icon={Ruler} description="Physical dimensions and calibration">
          <div className="space-y-6">
            {/* Geometry Section */}
            <div>
              <h4 className="text-sm font-medium uppercase mb-4 text-primary">Link Lengths (meters)</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="len-coxa" className="text-xs uppercase">
                      Coxa Length
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.geometry.len_coxa.toFixed(3)}m
                    </span>
                  </div>
                  <Input
                    id="len-coxa"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={legConfig.geometry.len_coxa}
                    onChange={(e) => handleGeometryUpdate("len_coxa", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Hip yaw to femur joint distance</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="len-femur" className="text-xs uppercase">
                      Femur Length
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.geometry.len_femur.toFixed(3)}m
                    </span>
                  </div>
                  <Input
                    id="len-femur"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={legConfig.geometry.len_femur}
                    onChange={(e) => handleGeometryUpdate("len_femur", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Thigh length</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="len-tibia" className="text-xs uppercase">
                      Tibia Length
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.geometry.len_tibia.toFixed(3)}m
                    </span>
                  </div>
                  <Input
                    id="len-tibia"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={legConfig.geometry.len_tibia}
                    onChange={(e) => handleGeometryUpdate("len_tibia", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Shank length</p>
                </div>
              </div>
            </div>

            {/* Offsets Section */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium uppercase mb-4 text-primary">Servo Calibration Offsets (radians)</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="offset-coxa" className="text-xs uppercase">
                      Coxa Offset
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.offsets.coxa_offset_rad.toFixed(3)} rad
                    </span>
                  </div>
                  <Input
                    id="offset-coxa"
                    type="number"
                    step="0.01"
                    min="-3.14159"
                    max="3.14159"
                    value={legConfig.offsets.coxa_offset_rad}
                    onChange={(e) => handleOffsetUpdate("coxa_offset_rad", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="offset-femur" className="text-xs uppercase">
                      Femur Offset
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.offsets.femur_offset_rad.toFixed(3)} rad
                    </span>
                  </div>
                  <Input
                    id="offset-femur"
                    type="number"
                    step="0.01"
                    min="-3.14159"
                    max="3.14159"
                    value={legConfig.offsets.femur_offset_rad}
                    onChange={(e) => handleOffsetUpdate("femur_offset_rad", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="offset-tibia" className="text-xs uppercase">
                      Tibia Offset
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {legConfig.offsets.tibia_offset_rad.toFixed(3)} rad
                    </span>
                  </div>
                  <Input
                    id="offset-tibia"
                    type="number"
                    step="0.01"
                    min="-3.14159"
                    max="3.14159"
                    value={legConfig.offsets.tibia_offset_rad}
                    onChange={(e) => handleOffsetUpdate("tibia_offset_rad", Number.parseFloat(e.target.value) || 0)}
                    className="w-full font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* 3D Leg Visualization */}
      <div className="space-y-6">
        <ConfigCard title="Leg Preview" description="Real-time visualization">
          <LegVisualization
            legId={selectedLeg}
            legName={LEG_NAMES[legIndex]}
            servos={legConfig.servos}
            testingServo={testingServo}
          />
        </ConfigCard>

        <ConfigCard title="Calibration Guide">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                1
              </div>
              <p className="text-muted-foreground">
                Set the center position for each servo to achieve a neutral stance
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                2
              </div>
              <p className="text-muted-foreground">Adjust min/max values to define the range of motion</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                3
              </div>
              <p className="text-muted-foreground">Use the test button to verify servo movement</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                4
              </div>
              <p className="text-muted-foreground">Enable reverse if servo direction is inverted</p>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
