import DashboardPageLayout from "@/components/dashboard/layout"
import { BarChart3 } from "lucide-react"
import { TelemetryPanel } from "@/components/configurator/telemetry-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function TelemetryPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Telemetry & Monitoring",
        description: "Real-time system health and performance",
        icon: BarChart3,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <TelemetryPanel />
      </div>
    </DashboardPageLayout>
  )
}
