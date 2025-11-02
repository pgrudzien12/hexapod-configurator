import DashboardPageLayout from "@/components/dashboard/layout"
import { Gamepad2 } from "lucide-react"
import { ControllerSettingsPanel } from "@/components/configurator/controller-settings-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function ControllerSettingsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Controller Settings",
        description: "FlySky and ESP-NOW configuration",
        icon: Gamepad2,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <ControllerSettingsPanel />
      </div>
    </DashboardPageLayout>
  )
}
