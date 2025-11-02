"use client"

import { useState } from "react"
import { ConfigCard } from "./config-card"
import { Database, Save, Upload, Download, Trash2, Copy, CheckCircle2 } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConfigProfile {
  id: string
  name: string
  description: string
  date: string
  version: string
}

const SAMPLE_PROFILES: ConfigProfile[] = [
  {
    id: "default",
    name: "Factory Default",
    description: "Original factory configuration",
    date: "2024-01-15",
    version: "v1.0",
  },
  {
    id: "outdoor",
    name: "Outdoor Terrain",
    description: "Optimized for rough outdoor surfaces",
    date: "2024-02-20",
    version: "v1.2",
  },
  {
    id: "speed",
    name: "Speed Mode",
    description: "Maximum speed configuration",
    date: "2024-03-10",
    version: "v1.3",
  },
]

export function ConfigManagementPanel() {
  const { config, saveConfig, loadConfig, resetConfig } = useConfig()
  const [profiles] = useState<ConfigProfile[]>(SAMPLE_PROFILES)
  const [profileName, setProfileName] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveProfile = () => {
    if (!profileName.trim()) return

    saveConfig()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setProfileName("")
  }

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `hexapod-config-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedConfig = JSON.parse(event.target?.result as string)
          loadConfig(importedConfig)
          alert("Configuration imported successfully!")
        } catch (error) {
          alert("Error importing configuration file")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Save Current Configuration */}
      <div className="space-y-6">
        <ConfigCard title="Save Configuration" icon={Save}>
          <div className="space-y-4">
            {saveSuccess && (
              <Alert>
                <CheckCircle2 className="size-4" />
                <AlertDescription className="text-xs">
                  Configuration saved successfully to browser storage!
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="profile-name" className="text-xs uppercase mb-2 block">
                Profile Name
              </Label>
              <Input
                id="profile-name"
                placeholder="e.g., My Custom Setup"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full" disabled={!profileName.trim()}>
              <Save className="size-4 mr-2" />
              Save Current Configuration
            </Button>

            <div className="pt-4 border-t border-border">
              <div className="text-xs uppercase text-muted-foreground mb-3">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleExportConfig}>
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportConfig}>
                  <Upload className="size-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </ConfigCard>

        <ConfigCard title="Backup & Restore" icon={Database}>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a backup of your current configuration or restore from a previous backup.
            </p>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="size-4 mr-2" />
                Create Backup
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="size-4 mr-2" />
                Restore from Backup
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive bg-transparent"
                onClick={resetConfig}
              >
                <Trash2 className="size-4 mr-2" />
                Reset to Factory Defaults
              </Button>
            </div>
          </div>
        </ConfigCard>
      </div>

      {/* Load Saved Profiles */}
      <div className="space-y-6">
        <ConfigCard title="Saved Profiles" description="Load a previously saved configuration">
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-display text-sm uppercase">{profile.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{profile.description}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{profile.version}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{profile.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Upload className="size-3 mr-1" />
                      Load
                    </Button>
                    {profile.id !== "default" && (
                      <Button size="sm" variant="outline">
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ConfigCard>

        <ConfigCard title="Configuration Info">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Last Saved</div>
                <div className="text-sm font-mono">2 hours ago</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Config Version</div>
                <div className="text-sm font-mono">v2.1.3</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Total Profiles</div>
                <div className="text-sm font-mono">{profiles.length}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-xs text-muted-foreground mb-1">Storage Used</div>
                <div className="text-sm font-mono">24 KB</div>
              </div>
            </div>
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}
