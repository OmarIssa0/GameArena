"use client";

import { useCallback, useEffect, useState } from "react";
import { friendService } from "@/services/def/FriendService";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";

export function useFriendRequests() {
  const { isSocialConnected, isSocialConnecting, socialReconnectKey } = useConnections();
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [sentRequests, setSentRequests] = useState<IFriendRequestSent[]>([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const loading = isSocialConnecting || (isSocialConnected && !hasReceivedData);
  const isOffline = !isSocialConnected && !isSocialConnecting;

  useEffect(() => {
    const off = friendService.onFriendRequestUpdate((data) => {
      setRequests(data.received ?? []);
      setSentRequests(data.sent ?? []);
      setHasReceivedData(true);
    });

    if (isSocialConnected) {
      friendService.invokeFriendRequests().catch(() => {});
    }

    return () => {
      off();
    };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    friendService.invokeFriendRequests().catch(() => {});
  }, []);

  const accept = useCallback(async (senderId: string) => {
    try {
      await friendService.acceptFriendRequest(senderId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const decline = useCallback(async (senderId: string) => {
    try {
      await friendService.rejectFriendRequest(senderId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const send = useCallback(async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  const cancel = useCallback(async (receiverId: string) => {
    try {
      await friendService.cancelFriendRequest(receiverId);
    } catch {
      /* SignalR pushes update */
    }
  }, []);

  return {
    requests,
    sentRequests,
    loading,
    hasReceivedData,
    requestCount: requests.length,
    sentRequestCount: sentRequests.length,
    accept,
    decline,
    send,
    cancel,
    reload,
    isOffline,
  };
}