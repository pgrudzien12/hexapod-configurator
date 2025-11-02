import type React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ConfigCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function ConfigCard({ title, description, icon: Icon, children, className }: ConfigCardProps) {
  return (
    <div className={cn("bg-card rounded-lg border border-border p-6", className)}>
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-display uppercase text-3xl font-mono font-extrabold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
