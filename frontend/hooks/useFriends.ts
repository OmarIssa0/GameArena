"use client";

import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";

function useFriendList() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socialConnection) return;

    const handleFriends = (data: IUserSummary[]) => {
      setFriends(
        data
          .map((f) => ({ ...f, fullName: `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() }))
          .sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
      setLoading(false);
    };

    socialConnection.on("social:friends", handleFriends);

    if (isSocialConnected) {
      socialConnection.invoke("RequestSocialData").catch(() => {});
    }

    return () => { socialConnection.off("social:friends", handleFriends); };
  }, [socialConnection, isSocialConnected, socialReconnectKey]);

  useEffect(() => {
    if (!socialConnection) return;

    const setStatus = (userId: string, status: UserStatusEnum) =>
      setFriends((prev) => prev.map((f) => (f.id === userId ? { ...f, status } : f)));

    const on = (e: string, s: UserStatusEnum) =>
      socialConnection.on(e, ({ userId }: { userId: string }) => setStatus(userId, s));

    on("friend:online", UserStatusEnum.Online);
    on("friend:offline", UserStatusEnum.Offline);
    on("friend:ingame", UserStatusEnum.InGame);

    return () => {
      socialConnection.off("friend:online");
      socialConnection.off("friend:offline");
      socialConnection.off("friend:ingame");
    };
  }, [socialConnection]);

  const reload = useCallback(() => {
    if (socialConnection) {
      setLoading(true);
      socialConnection.invoke("RequestFriends").catch(() => {});
    }
  }, [socialConnection]);

  const onlineCount = useMemo(() => friends.filter((f) => f.status !== UserStatusEnum.Offline).length, [friends]);

  return { friends, loading, onlineCount, reload };
}

function useFriendRequests() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socialConnection) return;

    const handleRequests = (data: { received: IFriendRequestReceived[]; sent: IFriendRequestSent[] }) => {
      setRequests(data.received);
      setSentRequests(data.sent);
      setLoading(false);
    };

    socialConnection.on("social:requests", handleRequests);
    return () => { socialConnection.off("social:requests", handleRequests); };
  }, [socialConnection]);

  const reload = useCallback(() => {
    if (socialConnection) {
      setLoading(true);
      socialConnection.invoke("RequestFriendRequests").catch(() => {});
    }
  }, [socialConnection]);

  const accept = useCallback(async (senderId: string) => {
    try { await friendService.acceptFriendRequest(senderId); } catch { /* SignalR pushes update */ }
  }, []);

  const decline = useCallback(async (senderId: string) => {
    try { await friendService.rejectFriendRequest(senderId); } catch { /* SignalR pushes update */ }
  }, []);

  const send = useCallback(async (friendId: string) => {
    try { await friendService.sendFriendRequest(friendId); } catch { /* SignalR pushes update */ }
  }, []);

  return { requests, sentRequests, loading, requestCount: requests.length, sentRequestCount: sentRequests.length, accept, decline, send, reload };
}

function useBlockedUsers() {
  const { socialConnection, isSocialConnected, socialReconnectKey } = useConnections();
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBlockedSignal = useCallback((data: IUserSummary[]) => {
    setBlockedUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!socialConnection) return;

    socialConnection.on("social:blocked", handleBlockedSignal);
    return () => { socialConnection.off("social:blocked", handleBlockedSignal); };
  }, [socialConnection, handleBlockedSignal]);

  const reload = useCallback(() => {
    setLoading(true);
    if (socialConnection) {
      socialConnection.invoke("RequestBlocked").catch(() => {});
    }
  }, [socialConnection]);

  return { blockedUsers, loading, reload };
}

function useFriends() {
  const { friends, loading: friendsLoading, onlineCount, reload: reloadFriends } = useFriendList();
  const { requests, sentRequests, loading: requestsLoading, requestCount, sentRequestCount, accept: acceptRequest, decline: declineRequest, send: sendRequest, reload: reloadRequests } = useFriendRequests();
  const { blockedUsers, loading: blockedLoading, reload: reloadBlocked } = useBlockedUsers();

  const removeFriend = useCallback(async (friendId: string) => {
    await friendService.removeFriend(friendId);
  }, []);

  const blockUser = useCallback(async (blockedId: string) => {
    await friendService.blockUser(blockedId);
  }, []);

  const unblockUser = useCallback(async (blockedId: string) => {
    await friendService.unblockUser(blockedId);
    reloadBlocked();
  }, [reloadBlocked]);

  const cancelFriendRequest = useCallback(async (receiverId: string) => {
    await friendService.cancelFriendRequest(receiverId);
  }, []);

  const handleAccept = useCallback(async (senderId: string) => {
    await acceptRequest(senderId);
  }, [acceptRequest]);

  const handleDecline = useCallback(async (senderId: string) => {
    await declineRequest(senderId);
  }, [declineRequest]);

  return {
    friends, requests, sentRequests, blockedUsers,
    friendsLoading, requestsLoading, blockedLoading,
    loading: friendsLoading || requestsLoading || blockedLoading,
    requestCount, sentRequestCount, blockedCount: blockedUsers.length, onlineCount,
    sendRequest, acceptRequest: handleAccept, declineRequest: handleDecline,
    removeFriend, blockUser, unblockUser, cancelFriendRequest,
    reload: async () => { reloadFriends(); reloadRequests(); reloadBlocked(); },
  };
}

export { useFriendList, useFriendRequests, useBlockedUsers, useFriends };