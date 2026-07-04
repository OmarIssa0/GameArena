"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { chatService } from "@/services/def/ChatService";
import { useConnections } from "./ConnectionProvider";
import { friendService } from "@/services/def/FriendService";
import type {
  IGameInvite,
  INotificationState,
} from "@/domain/meta/INotification";
import type { IChatNotificationPayload } from "@/domain/meta/IChatNotificationPayload";
import type { IFriendRequestPayload } from "@/domain/meta/IFriendRequestPayload";

const NotificationContext = createContext<INotificationState | undefined>(
  undefined,
);

export function DashboardNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notificationConnection, gameConnection } = useConnections();
  const [notifications, setNotifications] = useState({
    friendRequestCount: 0,
    unreadMessageCount: 0,
    gameInvites: [] as IGameInvite[],
  });

  const { friendRequestCount, unreadMessageCount, gameInvites } = notifications;

  const syncFriendRequests = useCallback(async () => {
    try {
      const response = await friendService.getReceivedFriendRequests();

      setNotifications((prev) => ({
        ...prev,
        friendRequestCount: response.data?.length ?? 0,
      }));
    } catch (error) {
      console.error("Failed to sync friend requests", error);
    }
  }, []);

  const syncUnreadMessages = useCallback(async () => {
    try {
      const response = await chatService.getUnreadMessageCount();

      setNotifications((prev) => ({
        ...prev,
        unreadMessageCount: response.data ?? 0,
      }));
    } catch (error) {
      console.error("Failed to sync unread messages", error);
    }
  }, []);

  const syncCounts = useCallback(async () => {
    await Promise.all([syncFriendRequests(), syncUnreadMessages()]);
  }, [syncFriendRequests, syncUnreadMessages]);

  useEffect(() => {
    if (!user) {
      setNotifications({
        friendRequestCount: 0,
        unreadMessageCount: 0,
        gameInvites: [],
      });
      return;
    }

    void syncCounts();
  }, [user, syncCounts]);
  useEffect(() => {
    if (!notificationConnection) return;

    const handleFriendRequest = (_payload: IFriendRequestPayload) => {
      setNotifications((prev) => ({
        ...prev,
        friendRequestCount: prev.friendRequestCount + 1,
      }));
    };

    const handleChatNotification = (payload: IChatNotificationPayload) => {
      if (!user) return;

      const selectedFriendId = searchParams.get("friend");
      const isOpenConversation =
        pathname === "/messages" && selectedFriendId === payload.senderId;

      if (!isOpenConversation) {
        setNotifications((prev) => ({
          ...prev,
          unreadMessageCount: prev.unreadMessageCount + 1,
        }));
      }
    };

    const handleGameInvite = (payload: IGameInvite) => {
      setNotifications((prev) => ({
        ...prev,
        gameInvites: prev.gameInvites.some((i) => i.roomId === payload.roomId)
          ? prev.gameInvites
          : [...prev.gameInvites, payload],
      }));
    };

    notificationConnection.on("friend:request", handleFriendRequest);
    notificationConnection.on("chat:notification", handleChatNotification);
    notificationConnection.on("GameInvite", handleGameInvite);

    return () => {
      notificationConnection.off("friend:request", handleFriendRequest);
      notificationConnection.off("chat:notification", handleChatNotification);
      notificationConnection.off("GameInvite", handleGameInvite);
    };
  }, [notificationConnection, pathname, searchParams, user]);

  const acceptGameInvite = useCallback(
    async (roomId: string) => {
      if (!gameConnection) return;

      await gameConnection.invoke("AcceptInvite", roomId);

      setNotifications((prev) => ({
        ...prev,
        gameInvites: prev.gameInvites.filter((i) => i.roomId !== roomId),
      }));
    },
    [gameConnection],
  );

  const dismissGameInvite = useCallback((roomId: string) => {
    setNotifications((prev) => ({
      ...prev,
      gameInvites: prev.gameInvites.filter((i) => i.roomId !== roomId),
    }));
  }, []);

  const value = useMemo<INotificationState>(
    () => ({
      friendRequestCount,
      unreadMessageCount,
      gameInvites,

      syncCounts,
      refreshUnreadMessages: syncUnreadMessages,
      refreshFriendRequests: syncFriendRequests,

      dismissGameInvite,
      acceptGameInvite,
    }),
    [
      friendRequestCount,
      unreadMessageCount,
      gameInvites,
      syncCounts,
      syncUnreadMessages,
      syncFriendRequests,
      dismissGameInvite,
      acceptGameInvite,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useDashboardNotifications(): INotificationState {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useDashboardNotifications must be used within DashboardNotificationsProvider.",
    );
  }
  return ctx;
}
