import DashboardPageLayout from "@/components/dashboard/layout"
import { Activity } from "lucide-react"
import { LegConfigurationPanel } from "@/components/configurator/leg-configuration-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function LegConfigurationPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Leg Configuration",
        description: "Individual servo tuning and calibration",
        icon: Activity,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <LegConfigurationPanel />
      </div>
    </DashboardPageLayout>
  )
}
