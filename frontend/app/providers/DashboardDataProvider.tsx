"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConnections } from "./ConnectionProvider";
import { useAuth } from "./AuthProvider";
import { notificationService } from "@/services/def/NotificationService";
import { gameService } from "@/services/def/GameService";
import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { IDashboardDataContext } from "./def/IDashboardDataContext";
import type { IGameInvite, INotificationItem } from "@/domain/meta/INotification";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { TNullable, TOptional } from "@/domain/type/TCommon";

const DashboardDataContext = createContext<TOptional<IDashboardDataContext>>(undefined);

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const { isSocialConnected, isSocialConnecting, socialReconnectKey } = useConnections();
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [friendsReceived, setFriendsReceived] = useState(false);
  const [requestsReceived, setRequestsReceived] = useState(false);
  const [blockedReceived, setBlockedReceived] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [gameInvites, setGameInvites] = useState<IGameInvite[]>([]);
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);

  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);
  const audioRef = useRef<TNullable<HTMLAudioElement>>(null);
  const soundEnabledRef = useRef(true);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (user?.preferences) {
      try {
        const prefs = JSON.parse(user.preferences) as IUserPreferences;
        soundEnabledRef.current = prefs.soundEnabled ?? true;
      } catch {
        soundEnabledRef.current = true;
      }
    }
  }, [user?.preferences]);

  const playNotificationSound = () => {
    if (!soundEnabledRef.current) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/1877.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    const offList = friendService.onFriendListUpdate((data) => {
      setFriends(data);
      setFriendsReceived(true);
    });
    const offStatus = friendService.onFriendStatusChange((userId, status) => {
      setFriends((prev) => prev.map((f) => (f.id === userId ? { ...f, status } : f)));
    });
    const offRequests = friendService.onFriendRequestUpdate((data) => {
      setRequests(data.received ?? []);
      setSentRequests(data.sent ?? []);
      setRequestsReceived(true);
    });
    const offBlocked = friendService.onBlockedUsersUpdate((data) => {
      setBlockedUsers(data);
      setBlockedReceived(true);
    });
    return () => {
      offList();
      offStatus();
      offRequests();
      offBlocked();
    };
  }, []);

  useEffect(() => {
    const off1 = notificationService.onCountersUpdate((c) => {
      setFriendRequestCount(c.receivedFriendRequests ?? 0);
      setUnreadMessageCount(c.unreadMessages ?? 0);
    });
    const off2 = notificationService.onChatNotification((p) => {
      const selected = searchParamsRef.current.get("friend");
      if (pathnameRef.current !== "/messages" || selected !== p.senderId) setUnreadMessageCount((n) => n + 1);
      playNotificationSound();
    });
    const off3 = notificationService.onNewNotification((n) => {
      setNotifications((prev) => [n, ...prev]);
      playNotificationSound();
    });
    const off4 = notificationService.onNotificationList((list) => {
      setNotifications((prev) => {
        const incomingIds = new Set(list.map((n) => n.id));
        const localOnly = prev.filter((n) => !incomingIds.has(n.id));
        return [...list, ...localOnly].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    });
    return () => {
      off1();
      off2();
      off3();
      off4();
    };
  }, []);

  useEffect(() => {
    const off = gameService.onGameInvite((p) => {
      setGameInvites((prev) => (prev.some((i) => i.roomId === p.roomId) ? prev : [...prev, p]));
      playNotificationSound();
    });
    return () => off();
  }, []);

  useEffect(() => {
    if (!isSocialConnected) return;
    friendService.invokeFriends().catch(() => {});
    friendService.invokeFriendRequests().catch(() => {});
    friendService.invokeBlocked().catch(() => {});
    notificationService.requestCounters().catch(() => {});
    notificationService.requestNotificationList().catch(() => {});
  }, [isSocialConnected, socialReconnectKey]);

  const sendRequest = useCallback(async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId);
    } catch {}
  }, []);

  const acceptRequest = useCallback(async (senderId: string) => {
    try {
      await friendService.acceptFriendRequest(senderId);
    } catch {}
  }, []);

  const declineRequest = useCallback(async (senderId: string) => {
    try {
      await friendService.rejectFriendRequest(senderId);
    } catch {}
  }, []);

  const cancelRequest = useCallback(async (receiverId: string) => {
    try {
      await friendService.cancelFriendRequest(receiverId);
    } catch {}
  }, []);

  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await friendService.removeFriend(friendId);
    } catch {}
  }, []);

  const blockUser = useCallback(async (blockedId: string) => {
    try {
      await friendService.blockUser(blockedId);
    } catch {}
  }, []);

  const unblockUser = useCallback(async (blockedId: string) => {
    try {
      await friendService.unblockUser(blockedId);
    } catch {}
  }, []);

  const dismissGameInvite = useCallback((roomId: string) => {
    setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
  }, []);

  const acceptGameInvite = useCallback(async (roomId: string) => {
    await gameService.acceptInvite(roomId);
    setGameInvites((prev) => prev.filter((i) => i.roomId !== roomId));
  }, []);

  const reload = useCallback(() => {
    friendService.invokeFriends().catch(() => {});
    friendService.invokeFriendRequests().catch(() => {});
    friendService.invokeBlocked().catch(() => {});
    notificationService.requestCounters().catch(() => {});
    notificationService.requestNotificationList().catch(() => {});
  }, []);

  const friendsLoading = isSocialConnecting || (isSocialConnected && !friendsReceived);
  const requestsLoading = isSocialConnecting || (isSocialConnected && !requestsReceived);
  const blockedLoading = isSocialConnecting || (isSocialConnected && !blockedReceived);
  const loading = friendsLoading || requestsLoading || blockedLoading;
  const isOffline = !isSocialConnected && !isSocialConnecting;
  const onlineCount = friends.filter((f) => f.status !== UserStatusEnum.Offline).length;
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const value = useMemo<IDashboardDataContext>(
    () => ({
      friends,
      requests,
      sentRequests,
      blockedUsers,
      friendsLoading,
      requestsLoading,
      blockedLoading,
      loading,
      isOffline,
      onlineCount,
      requestCount: requests.length,
      sentRequestCount: sentRequests.length,
      blockedCount: blockedUsers.length,
      friendRequestCount,
      unreadMessageCount,
      unreadNotificationCount,
      gameInvites,
      notifications,
      sendRequest,
      acceptRequest,
      declineRequest,
      cancelRequest,
      removeFriend,
      blockUser,
      unblockUser,
      dismissGameInvite,
      acceptGameInvite,
      reload,
    }),
    [
      friends,
      requests,
      sentRequests,
      blockedUsers,
      friendsLoading,
      requestsLoading,
      blockedLoading,
      loading,
      isOffline,
      onlineCount,
      friendRequestCount,
      unreadMessageCount,
      unreadNotificationCount,
      gameInvites,
      notifications,
      sendRequest,
      acceptRequest,
      declineRequest,
      cancelRequest,
      removeFriend,
      blockUser,
      unblockUser,
      dismissGameInvite,
      acceptGameInvite,
      reload,
    ],
  );

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData(): IDashboardDataContext {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboardData must be used within DashboardDataProvider");
  return ctx;
}