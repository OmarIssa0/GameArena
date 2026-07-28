"use client";

import { useCallback, useMemo } from "react";
import { friendService } from "@/services/def/FriendService";
import { useFriendList } from "./useFriendList";
import { useFriendRequests } from "./useFriendRequests";
import { useBlockedUsers } from "./useBlockedUsers";

export function useFriends() {
  const {
    friends,
    loading: friendsLoading,
    hasReceivedData: friendsReceived,
    onlineCount,
    reload: reloadFriends,
    isOffline: friendsOffline,
  } = useFriendList();

  const {
    requests,
    sentRequests,
    loading: requestsLoading,
    hasReceivedData: requestsReceived,
    requestCount,
    sentRequestCount,
    accept,
    decline,
    send,
    cancel,
    reload: reloadRequests,
    isOffline: requestsOffline,
  } = useFriendRequests();

  const {
    blockedUsers,
    loading: blockedLoading,
    hasReceivedData: blockedReceived,
    reload: reloadBlocked,
    isOffline: blockedOffline,
  } = useBlockedUsers();

  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await friendService.removeFriend(friendId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const blockUser = useCallback(async (blockedId: string) => {
    try {
      await friendService.blockUser(blockedId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const unblockUser = useCallback(async (blockedId: string) => {
    try {
      await friendService.unblockUser(blockedId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const reload = useCallback(() => {
    reloadFriends();
    reloadRequests();
    reloadBlocked();
  }, [reloadFriends, reloadRequests, reloadBlocked]);

  // Aggregate loading — true if ANY sub-hook is still loading
  const loading = friendsLoading || requestsLoading || blockedLoading;
  const isOffline = friendsOffline && requestsOffline && blockedOffline;

  return {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    requestsLoading,
    blockedLoading,
    loading,
    isOffline,
    hasReceivedData: friendsReceived && requestsReceived && blockedReceived,
    requestCount,
    sentRequestCount,
    blockedCount: blockedUsers.length,
    onlineCount,
    sendRequest: send,
    acceptRequest: accept,
    declineRequest: decline,
    removeFriend,
    blockUser,
    unblockUser,
    cancelFriendRequest: cancel,
    reload,
  };
}
