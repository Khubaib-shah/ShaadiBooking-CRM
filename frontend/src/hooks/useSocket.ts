"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/lib/stores/auth";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

/**
 * useSocket Hook
 * ──────────────
 * Manages a Socket.IO connection with JWT authentication.
 * Automatically connects/disconnects based on auth state.
 *
 * @example
 *   const { subscribe, emit } = useSocket();
 *
 *   useEffect(() => {
 *     const unsub = subscribe("notification:new", (data) => {
 *       console.log("New notification:", data);
 *     });
 *     return unsub;
 *   }, [subscribe]);
 */
export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Create socket connection with JWT auth
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.info("[Socket] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.info("[Socket] Disconnected:", reason);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  /**
   * Subscribe to a Socket.IO event.
   * Returns an unsubscribe function.
   */
  const subscribe = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};

      socket.on(event, handler);
      return () => {
        socket.off(event, handler);
      };
    },
    []
  );

  /**
   * Emit an event to the server.
   */
  const emit = useCallback(
    (event: string, ...args: unknown[]) => {
      const socket = socketRef.current;
      if (!socket) {
        console.warn("[Socket] Cannot emit — not connected.");
        return;
      }
      socket.emit(event, ...args);
    },
    []
  );

  return { subscribe, emit, isConnected };
}
