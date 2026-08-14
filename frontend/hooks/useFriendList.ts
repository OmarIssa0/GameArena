"use client";

import { useCallback, useEffect, useState } from "react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

export function useFriendList() {
  const { isSocialConnected, isSocialConnecting, socialReconnectKey } = useConnections();
  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const loading = isSocialConnecting || (isSocialConnected && !hasReceivedData);
  const isOffline = !isSocialConnected && !isSocialConnecting;

  useEffect(() => {
    const offList = friendService.onFriendListUpdate((data) => {
      setFriends(data);
      setHasReceivedData(true);
    });

    const offStatus = friendService.onFriendStatusChange((userId, status) => {
      setFriends((prev) =>
        prev.map((f) => (f.id === userId ? { ...f, status } : f))
      );
    });

    if (isSocialConnected) {
      friendService.invokeFriends().catch(() => {});
    }

    return () => {
      offList();
      offStatus();
    };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    friendService.invokeFriends().catch(() => {});
  }, []);

  const onlineCount = friends.filter((f) => f.status !== UserStatusEnum.Offline).length;

  return { friends, loading, hasReceivedData, onlineCount, reload, isOffline };
}