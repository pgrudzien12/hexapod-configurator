"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

interface WebSocketContextType {
  status: ConnectionStatus
  lastMessage: any
  sendMessage: (message: any) => void
  connect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider")
  }
  return context
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  const connect = useCallback(() => {
    // Simulated WebSocket connection for demo purposes
    // In production, this would connect to ESP32 WebSocket server
    console.log("[v0] Simulating WebSocket connection to hexapod...")
    setStatus("connecting")

    setTimeout(() => {
      setStatus("connected")
      console.log("[v0] WebSocket connected (simulated)")
    }, 1000)
  }, [])

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close()
    }
    setStatus("disconnected")
    console.log("[v0] WebSocket disconnected")
  }, [ws])

  const sendMessage = useCallback(
    (message: any) => {
      if (status === "connected") {
        console.log("[v0] Sending message:", message)
        // Simulate response
        setTimeout(() => {
          setLastMessage({ type: "response", data: message })
        }, 100)
      } else {
        console.warn("[v0] Cannot send message: not connected")
      }
    },
    [status],
  )

  useEffect(() => {
    // Auto-connect on mount for demo
    connect()
    return () => disconnect()
  }, [])

  return (
    <WebSocketContext.Provider value={{ status, lastMessage, sendMessage, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  )
}
