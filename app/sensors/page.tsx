import DashboardPageLayout from "@/components/dashboard/layout"
import { Compass } from "lucide-react"
import { SensorsPanel } from "@/components/configurator/sensors-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function SensorsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Sensors & IMU",
        description: "Calibration and monitoring",
        icon: Compass,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <SensorsPanel />
      </div>
    </DashboardPageLayout>
  )
}
