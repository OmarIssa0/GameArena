"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { HubConnection } from "@microsoft/signalr";
import { useConnection } from "@/hooks/useConnection";

interface IConnectionContext {
  chatConnection: HubConnection | null;
  gameConnection: HubConnection | null;
  isChatConnected: boolean;
  isGameConnected: boolean;
}

const ConnectionContext = createContext<IConnectionContext | undefined>(
  undefined,
);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { connection: chatConnection, isConnected: isChatConnected } =
    useConnection("chatHub");
  const { connection: gameConnection, isConnected: isGameConnected } =
    useConnection("gameHub");

  const value = useMemo<IConnectionContext>(
    () => ({
      chatConnection,
      gameConnection,
      isChatConnected,
      isGameConnected,
    }),
    [chatConnection, gameConnection, isChatConnected, isGameConnected],
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
