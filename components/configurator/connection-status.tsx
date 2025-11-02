"use client"

import { useWebSocket } from "@/lib/websocket-context"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

export function ConnectionStatus() {
  const { status, connect, disconnect } = useWebSocket()

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 flex-1">
        {status === "connected" && (
          <>
            <Wifi className="size-5 text-success" />
            <span className="text-sm font-medium">Connected to Hexapod</span>
          </>
        )}
        {status === "connecting" && (
          <>
            <Loader2 className="size-5 text-warning animate-spin" />
            <span className="text-sm font-medium">Connecting...</span>
          </>
        )}
        {status === "disconnected" && (
          <>
            <WifiOff className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Disconnected</span>
          </>
        )}
        {status === "error" && (
          <>
            <WifiOff className="size-5 text-destructive" />
            <span className="text-sm font-medium">Connection Error</span>
          </>
        )}
      </div>

      {status === "disconnected" && (
        <button
          onClick={connect}
          className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Connect
        </button>
      )}

      {status === "connected" && (
        <button
          onClick={disconnect}
          className="px-3 py-1.5 text-xs font-medium bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
        >
          Disconnect
        </button>
      )}
    </div>
  )
}
