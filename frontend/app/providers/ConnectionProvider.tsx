"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useConnection } from "@/hooks/useConnection";
import type { IConnectionContext } from "@/domain/meta/IConnectionContext";

const ConnectionContext = createContext<IConnectionContext | undefined>(
  undefined,
);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { connection: chatConnection, isConnected: isChatConnected } =
    useConnection("chatHub");
  const { connection: gameConnection, isConnected: isGameConnected } =
    useConnection("gameHub");
  const {
    connection: notificationConnection,
    isConnected: isNotificationConnected,
  } = useConnection("notificationHub");

  const value = useMemo<IConnectionContext>(
    () => ({
      chatConnection,
      gameConnection,
      notificationConnection,
      isChatConnected,
      isGameConnected,
      isNotificationConnected,
    }),
    [
      chatConnection,
      gameConnection,
      notificationConnection,
      isChatConnected,
      isGameConnected,
      isNotificationConnected,
    ],
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections(): IConnectionContext {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnections must be used within a ConnectionProvider.");
  }
  return ctx;
}
