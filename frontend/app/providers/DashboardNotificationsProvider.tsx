"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "./ConnectionProvider";
import { notificationService } from "@/services/def/NotificationService";
import { gameService } from "@/services/def/GameService";
import type { IGameInvite, INotificationState } from "@/domain/meta/INotification";

const NotificationContext = createContext<INotificationState | undefined>(undefined);

export function DashboardNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSocialConnected, socialReconnectKey } = useConnections();

  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);

  useEffect(() => {
    if (!user) {
      setFriendRequestCount(0);
      setUnreadMessageCount(0);
      setGameInvites([]);
    }
  }, [user]);

  // ── Notification subscriptions via service ───────────────────────────
  useEffect(() => {
    const off1 = notificationService.onCountersUpdate((counters) => {
      setFriendRequestCount(counters.friendRequests);
      setUnreadMessageCount(counters.unreadMessages);
    });

    const off2 = notificationService.onChatNotification((payload) => {
      if (!user) return;
      const selectedFriendId = searchParamsRef.current.get("friend");
      const isOpen = pathnameRef.current === "/messages" && selectedFriendId === payload.senderId;
      if (!isOpen) setUnreadMessageCount((prev) => prev + 1);
    });

    return () => { off1(); off2(); };
  }, [user]);

  // ── Fetch counters on connect/reconnect ─────────────────────────────
  useEffect(() => {
    if (!isSocialConnected) return;

    notificationService.requestCounters().catch(() => {});
    const retry = setTimeout(() => notificationService.requestCounters().catch(() => {}), 500);
    return () => clearTimeout(retry);
  }, [isSocialConnected, socialReconnectKey]);

  // ── Game invites via service ─────────────────────────────────────────
  useEffect(() => {
    const off = gameService.onGameInvite((payload) => {
      setGameInvites((prev) => (prev.some((i) => i.roomId === payload.roomId) ? prev : [...prev, payload]));
    });

    return () => { off(); };
  }, []);

  const acceptGameInvite = useCallback(
    async (roomId: string) => {
      await gameService.acceptInvite(roomId);
      setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
    },
    [],
  );

  const dismissGameInvite = useCallback((roomId: string) => {
    setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
  }, []);

  const value = useMemo<INotificationState>(
    () => ({
      friendRequestCount,
      unreadMessageCount,
      gameInvites,
      dismissGameInvite,
      acceptGameInvite,
    }),
    [friendRequestCount, unreadMessageCount, gameInvites, dismissGameInvite, acceptGameInvite],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useDashboardNotifications(): INotificationState {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useDashboardNotifications must be used within DashboardNotificationsProvider.");
  }
  return ctx;
}
