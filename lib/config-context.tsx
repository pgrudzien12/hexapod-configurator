"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface HexapodConfig {
  // Leg Configuration
  legs: {
    [key: string]: {
      servos: {
        coxa: { min: number; max: number; center: number; reversed: boolean; pin: number }
        femur: { min: number; max: number; center: number; reversed: boolean; pin: number }
        tibia: { min: number; max: number; center: number; reversed: boolean; pin: number }
      }
      geometry: {
        len_coxa: number // distance from hip yaw joint to femur joint (meters)
        len_femur: number // thigh length (meters)
        len_tibia: number // shank length (meters)
      }
      offsets: {
        coxa_offset_rad: number // coxa servo calibration offset (radians)
        femur_offset_rad: number // femur servo calibration offset (radians)
        tibia_offset_rad: number // tibia servo calibration offset (radians)
      }
      enabled: boolean
    }
  }

  // Motion Control
  motion: {
    gaitType: "tripod" | "wave" | "ripple"
    speed: number
    stepHeight: number
    bodyHeight: number
  }

  // Controller Settings
  controller: {
    type: "flysky" | "espnow"
    channels: { [key: string]: number }
    deadzone: number
  }

  // Sensors & IMU
  sensors: {
    imu: {
      calibrated: boolean
      offsets: { x: number; y: number; z: number }
    }
    touchSensors: {
      enabled: boolean
      threshold: number
    }
  }

  // System Parameters
  system: {
    safeMode: boolean
    maxSpeed: number
    powerSaving: boolean
  }
}

const defaultConfig: HexapodConfig = {
  legs: {
    "leg-1": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 0 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 1 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 2 },
      },
      geometry: {
        len_coxa: 0.05, // 50mm default
        len_femur: 0.08, // 80mm default
        len_tibia: 0.12, // 120mm default
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
    "leg-2": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 3 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 4 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 5 },
      },
      geometry: {
        len_coxa: 0.05,
        len_femur: 0.08,
        len_tibia: 0.12,
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
    "leg-3": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 6 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 7 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 8 },
      },
      geometry: {
        len_coxa: 0.05,
        len_femur: 0.08,
        len_tibia: 0.12,
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
    "leg-4": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 9 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 10 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 11 },
      },
      geometry: {
        len_coxa: 0.05,
        len_femur: 0.08,
        len_tibia: 0.12,
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
    "leg-5": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 12 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 13 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 14 },
      },
      geometry: {
        len_coxa: 0.05,
        len_femur: 0.08,
        len_tibia: 0.12,
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
    "leg-6": {
      servos: {
        coxa: { min: 500, max: 2500, center: 1500, reversed: false, pin: 15 },
        femur: { min: 500, max: 2500, center: 1500, reversed: false, pin: 16 },
        tibia: { min: 500, max: 2500, center: 1500, reversed: false, pin: 17 },
      },
      geometry: {
        len_coxa: 0.05,
        len_femur: 0.08,
        len_tibia: 0.12,
      },
      offsets: {
        coxa_offset_rad: 0.0,
        femur_offset_rad: 0.0,
        tibia_offset_rad: 0.0,
      },
      enabled: true,
    },
  },
  motion: {
    gaitType: "tripod",
    speed: 50,
    stepHeight: 30,
    bodyHeight: 80,
  },
  controller: {
    type: "flysky",
    channels: {},
    deadzone: 10,
  },
  sensors: {
    imu: {
      calibrated: false,
      offsets: { x: 0, y: 0, z: 0 },
    },
    touchSensors: {
      enabled: true,
      threshold: 500,
    },
  },
  system: {
    safeMode: true,
    maxSpeed: 100,
    powerSaving: false,
  },
}

interface ConfigContextType {
  config: HexapodConfig
  updateConfig: (path: string, value: any) => void
  resetConfig: () => void
  saveConfig: () => void
  loadConfig: (config: HexapodConfig) => void
}

const ConfigContext = createContext<ConfigContextType | null>(null)

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider")
  }
  return context
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<HexapodConfig>(defaultConfig)

  const updateConfig = useCallback((path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split(".")
      let current: any = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      console.log("[v0] Config updated:", path, "=", value)
      return newConfig
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
    console.log("[v0] Config reset to defaults")
  }, [])

  const saveConfig = useCallback(() => {
    localStorage.setItem("hexapod-config", JSON.stringify(config))
    console.log("[v0] Config saved to localStorage")
  }, [config])

  const loadConfig = useCallback((newConfig: HexapodConfig) => {
    setConfig(newConfig)
    console.log("[v0] Config loaded")
  }, [])

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig, saveConfig, loadConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
