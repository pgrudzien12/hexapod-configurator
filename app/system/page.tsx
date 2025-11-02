import DashboardPageLayout from "@/components/dashboard/layout"
import { Settings } from "lucide-react"
import { SystemParametersPanel } from "@/components/configurator/system-parameters-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function SystemParametersPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "System Parameters",
        description: "Safety limits and power management",
        icon: Settings,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <SystemParametersPanel />
      </div>
    </DashboardPageLayout>
  )
}
