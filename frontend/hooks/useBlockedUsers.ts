"use client";

import { useCallback, useEffect, useState } from "react";
import { friendService } from "@/services/def/FriendService";
import { useConnections } from "@/app/providers/ConnectionProvider";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

export function useBlockedUsers() {
  const { isSocialConnected, isSocialConnecting, socialReconnectKey } = useConnections();
  const [blockedUsers, setBlockedUsers] = useState<IUserSummary[]>([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const loading = isSocialConnecting || (isSocialConnected && !hasReceivedData);
  const isOffline = !isSocialConnected && !isSocialConnecting;

  useEffect(() => {
    const off = friendService.onBlockedUsersUpdate((data) => {
      setBlockedUsers(data);
      setHasReceivedData(true);
    });

    if (isSocialConnected) {
      friendService.invokeBlocked().catch(() => {});
    }

    return () => {
      off();
    };
  }, [isSocialConnected, socialReconnectKey]);

  const reload = useCallback(() => {
    friendService.invokeBlocked().catch(() => {});
  }, []);

  return { blockedUsers, loading, hasReceivedData, reload, isOffline };
}