"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Activity, Gauge, Gamepad2, Compass, Settings, Database, BarChart3, Save } from "lucide-react"
import MonkeyIcon from "@/components/icons/monkey"
import DotsVerticalIcon from "@/components/icons/dots-vertical"
import GearIcon from "@/components/icons/gear"
import { Bullet } from "@/components/ui/bullet"
import Image from "next/image"
import { useWebSocket } from "@/lib/websocket-context"

const data = {
  navMain: [
    {
      title: "Configuration",
      items: [
        {
          title: "Leg Configuration",
          url: "/",
          icon: Activity,
        },
        {
          title: "Motion Control",
          url: "/motion",
          icon: Gauge,
        },
        {
          title: "Controller",
          url: "/controller",
          icon: Gamepad2,
        },
        {
          title: "Sensors & IMU",
          url: "/sensors",
          icon: Compass,
        },
        {
          title: "System",
          url: "/system",
          icon: Settings,
        },
        {
          title: "Telemetry",
          url: "/telemetry",
          icon: BarChart3,
        },
        {
          title: "Config Manager",
          url: "/config",
          icon: Database,
        },
      ],
    },
  ],
  user: {
    name: "HEXAPOD",
    email: "configurator@hexapod.local",
    avatar: "/avatars/user_krimson.png",
  },
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { status } = useWebSocket()

  return (
    <Sidebar {...props} className={cn("py-sides", className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
          <MonkeyIcon className="size-10 group-hover:scale-[1.7] origin-top-left transition-transform" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="font-display text-5xl">HEXAPOD</span>
          <span className="text-xs uppercase">Configurator v1.0</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="rounded-t-none">
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            Connection
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-3 flex items-center gap-2">
              <div
                className={cn(
                  "size-2 rounded-full",
                  status === "connected" && "bg-success animate-pulse",
                  status === "connecting" && "bg-warning animate-pulse",
                  status === "disconnected" && "bg-muted-foreground",
                  status === "error" && "bg-destructive",
                )}
              />
              <span className="text-xs uppercase">
                {status === "connected" && "Connected"}
                {status === "connecting" && "Connecting..."}
                {status === "disconnected" && "Disconnected"}
                {status === "error" && "Error"}
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>
              <Bullet className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            Device
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger className="flex gap-0.5 w-full group cursor-pointer">
                    <div className="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                      <Image
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                        width={120}
                        height={120}
                      />
                    </div>
                    <div className="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xl font-display">{data.user.name}</span>
                        <span className="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                          {data.user.email}
                        </span>
                      </div>
                      <DotsVerticalIcon className="ml-auto size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={4}>
                    <div className="flex flex-col">
                      <button className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <Save className="mr-2 h-4 w-4" />
                        Save Config
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <GearIcon className="mr-2 h-4 w-4" />
                        Settings
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
