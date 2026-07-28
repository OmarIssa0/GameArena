"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { HubConnection } from "@microsoft/signalr";
import type { IConnectionContext } from "@/domain/meta/IConnectionContext";
import { ConnectionState, type HubConnectionStates } from "@/domain/enum/ConnectionState";
import { friendService } from "@/services/def/FriendService";
import { notificationService } from "@/services/def/NotificationService";
import { chatService } from "@/services/def/ChatService";
import { gameService } from "@/services/def/GameService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://gamearena-ppnc.onrender.com";

const ConnectionContext = createContext<IConnectionContext | undefined>(undefined);

function createConnection(name: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/${name}`, { withCredentials: true })
    .withAutomaticReconnect({ nextRetryDelayInMilliseconds: (retryContext) => Math.min(retryContext.elapsedMilliseconds * 1.5, 30000) })
    .withKeepAliveInterval(15_000)
    .withServerTimeout(60_000)
    .configureLogging(process.env.NODE_ENV === "development" ? LogLevel.Information : LogLevel.Error)
    .build();
}

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [chatConnection, setChatConnection] = useState<HubConnection | null>(null);
  const [gameConnection, setGameConnection] = useState<HubConnection | null>(null);
  const [socialConnection, setSocialConnection] = useState<HubConnection | null>(null);
  const [socialReconnectKey, setSocialReconnectKey] = useState(0);

  // Track connection states per hub
  const [connectionStates, setConnectionStates] = useState<HubConnectionStates>({
    chat: ConnectionState.Disconnected,
    game: ConnectionState.Disconnected,
    social: ConnectionState.Disconnected,
  });

  const chatRef = useRef<HubConnection | null>(null);
  const gameRef = useRef<HubConnection | null>(null);
  const socialRef = useRef<HubConnection | null>(null);
  const socialKeyRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    socialKeyRef.current = socialReconnectKey;
  }, [socialReconnectKey]);

  useEffect(() => {
    cancelledRef.current = false;

    const updateState = (hub: keyof HubConnectionStates, state: ConnectionState) => {
      setConnectionStates((prev) => ({ ...prev, [hub]: state }));
    };

    const startHub = async (
      name: string,
      hubKey: keyof HubConnectionStates,
      stateSetter: (conn: HubConnection | null) => void,
      ref: React.MutableRefObject<HubConnection | null>,
    ) => {
      const conn = createConnection(name);

      // Track state changes via SignalR events
      conn.onreconnecting(() => updateState(hubKey, ConnectionState.Reconnecting));
      conn.onreconnected(() => {
        updateState(hubKey, ConnectionState.Connected);

        if (name === "chatHub") {
          chatService.handleReconnect();
        } else if (name === "gameHub") {
          gameService.handleReconnect();
        } else if (name === "socialHub") {
          notificationService.handleReconnect();
          friendService.handleReconnect();
          setSocialReconnectKey((k) => k + 1);
        }
      });
      conn.onclose(() => updateState(hubKey, ConnectionState.Disconnected));

      updateState(hubKey, ConnectionState.Connecting);

      try {
        await conn.start();
        updateState(hubKey, ConnectionState.Connected);

        if (cancelledRef.current) {
          conn.stop().catch(() => {});
          return;
        }

        ref.current = conn;
        stateSetter(conn);
      } catch (err) {
        updateState(hubKey, ConnectionState.Disconnected);

        if (!cancelledRef.current && err instanceof Error && err.message.toLowerCase().includes("unauthorized")) {
          window.location.replace("/login");
        }
      }
    };

    startHub("chatHub", "chat", setChatConnection, chatRef);
    startHub("gameHub", "game", setGameConnection, gameRef);
    startHub("socialHub", "social", setSocialConnection, socialRef);

    return () => {
      cancelledRef.current = true;

      // Deregister callbacks before stopping
      if (chatRef.current) {
        chatRef.current.off("Reconnecting");
        chatRef.current.off("Reconnected");
        chatRef.current.off("Closed");
      }
      if (gameRef.current) {
        gameRef.current.off("Reconnecting");
        gameRef.current.off("Reconnected");
        gameRef.current.off("Closed");
      }
      if (socialRef.current) {
        socialRef.current.off("Reconnecting");
        socialRef.current.off("Reconnected");
        socialRef.current.off("Closed");
      }

      chatRef.current?.stop().catch(() => {});
      gameRef.current?.stop().catch(() => {});
      socialRef.current?.stop().catch(() => {});
      chatRef.current = null;
      gameRef.current = null;
      socialRef.current = null;
      setChatConnection(null);
      setGameConnection(null);
      setSocialConnection(null);
      setSocialReconnectKey(0);
      socialKeyRef.current = 0;

      setConnectionStates({
        chat: ConnectionState.Disconnected,
        game: ConnectionState.Disconnected,
        social: ConnectionState.Disconnected,
      });
    };
  }, []);

  // Gracefully stop all hubs (e.g. on logout) so the server's
  // OnDisconnectedAsync fires and broadcasts presence going offline.
  const stopConnections = useCallback(async () => {
    cancelledRef.current = true;
    const conns = [chatRef.current, gameRef.current, socialRef.current];
    chatRef.current = null;
    gameRef.current = null;
    socialRef.current = null;
    await Promise.all(conns.map((c) => c?.stop().catch(() => {})));
    setChatConnection(null);
    setGameConnection(null);
    setSocialConnection(null);
    setSocialReconnectKey(0);
    socialKeyRef.current = 0;
    setConnectionStates({
      chat: ConnectionState.Disconnected,
      game: ConnectionState.Disconnected,
      social: ConnectionState.Disconnected,
    });
  }, []);

  // ── Initialize services with connections ─────────────────────────────
  useEffect(() => {
    if (socialConnection) friendService.setConnection(socialConnection);
  }, [socialConnection]);

  useEffect(() => {
    if (socialConnection) notificationService.setConnection(socialConnection);
  }, [socialConnection]);

  useEffect(() => {
    if (chatConnection) chatService.setConnection(chatConnection);
  }, [chatConnection]);

  useEffect(() => {
    if (gameConnection) gameService.setConnection(gameConnection);
  }, [gameConnection]);

  // ── Derived booleans ──────────────────────────────────────────────────
  const value = useMemo<IConnectionContext>(() => {
    const cs = connectionStates;
    const isChatConnected = cs.chat === ConnectionState.Connected;
    const isGameConnected = cs.game === ConnectionState.Connected;
    const isSocialConnected = cs.social === ConnectionState.Connected;

    return {
      chatConnection,
      gameConnection,
      socialConnection,
      connectionStates: cs,
      isChatConnected,
      isGameConnected,
      isSocialConnected,
      isChatConnecting: cs.chat === ConnectionState.Connecting || cs.chat === ConnectionState.Reconnecting,
      isGameConnecting: cs.game === ConnectionState.Connecting || cs.game === ConnectionState.Reconnecting,
      isSocialConnecting: cs.social === ConnectionState.Connecting || cs.social === ConnectionState.Reconnecting,
      isAllConnected: isChatConnected && isGameConnected && isSocialConnected,
      socialReconnectKey,
      stopConnections,
    };
  }, [chatConnection, gameConnection, socialConnection, connectionStates, socialReconnectKey, stopConnections]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnections(): IConnectionContext {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnections must be used within a ConnectionProvider.");
  }
  return ctx;
}
