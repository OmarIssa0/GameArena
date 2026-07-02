"use client";

import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { FriendCard } from "@/component/friend/FriendCard";
import { EmptyState } from "@/component/common/GEmpty";
import type { IUser } from "@/domain/meta/IUser";
import { GButton } from "../common/GButton";
import { GErrorBanner } from "../common/GErrorBanner";
import { GSkeleton } from "../common/GSkeleton";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";

interface FriendsTabProps {
  onMessage: (friendId: string) => void;
  onInvite: (friendId: string) => void;
  onNavigateToSearch: () => void;
}

function FriendsTab({
  onMessage,
  onInvite,
  onNavigateToSearch,
}: FriendsTabProps) {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const [friends, setFriends] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await friendService.getFriends({
        name: null,
        userStatus: UserStatusEnum.All,
      });

      setFriends(response.data ?? []);
    } catch (err) {
      console.error("Failed to load friends", err);
      setError(t.loadError);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await friendService.getFriends({
          name: null,
          userStatus: UserStatusEnum.All,
        });

        if (!active) return;
        setFriends(response.data ?? []);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load friends", err);
        setError(t.loadError);
        setFriends([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [t.loadError]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center animate-pulse">
            <GSkeleton variant="rect" className="w-16 h-16 mb-2" />
            <GSkeleton variant="text" className="w-24 mb-1" />
            <GSkeleton variant="text" className="w-16 mb-4" />
            <div className="flex gap-2 w-full">
              <GSkeleton variant="rect" className="flex-1 h-9" />
              <GSkeleton variant="rect" className="flex-1 h-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <GErrorBanner message={error} onRetry={() => void loadFriends()} retryLabel={t.retry} />;
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-text-muted" />}
        title={t.noFriendsTitle}
        description={t.noFriendsDescription}
      >
        <GButton onClick={onNavigateToSearch} className="mt-4">
          {t.addFriend}
        </GButton>
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          user={friend}
          onMessage={() => onMessage(friend.id)}
          onInvite={() => onInvite(friend.id)}
        />
      ))}
    </div>
  );
}

export { FriendsTab };
