import DashboardPageLayout from "@/components/dashboard/layout"
import { Database } from "lucide-react"
import { ConfigManagementPanel } from "@/components/configurator/config-management-panel"
import { ConnectionStatus } from "@/components/configurator/connection-status"

export default function ConfigManagementPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Configuration Management",
        description: "Save, load, and manage configuration profiles",
        icon: Database,
      }}
    >
      <div className="space-y-6">
        <ConnectionStatus />
        <ConfigManagementPanel />
      </div>
    </DashboardPageLayout>
  )
}
