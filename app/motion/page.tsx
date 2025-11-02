import DashboardPageLayout from "@/components/dashboard/layout"
import { Gauge } from "lucide-react"
import { MotionControlPanel } from "@/components/configurator/motion-control-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function MotionControlPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Motion Control",
        description: "Gait patterns and movement parameters",
        icon: Gauge,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <MotionControlPanel />
      </div>
    </DashboardPageLayout>
  )
}
