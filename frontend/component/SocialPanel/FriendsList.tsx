"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, UsersRound } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GIcon } from "../common/GIcon";
import { GAvatar } from "../common/GAvatar";
import { GBadge } from "../common/GBadge";
import { GCard } from "../common/GCard";
import { GList } from "../common/GList";
import type { IFriendsListProps } from "./def/FriendsList";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";

export function FriendsList({ friends, query, unreadCounts, actions, noPagination = false }: IFriendsListProps) {
  const router = useRouter();
  const searchRegex = useMemo(() => {
    if (!query?.trim()) return null;
    try {
      return new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    } catch {
      return null;
    }
  }, [query]);

  const renderHighlightedName = (friend: IUserSummary) => {
    if (!searchRegex || !query) {
      return friend.fullName;
    }

    return friend?.fullName?.split(searchRegex).map((part, index) => {
      const isMatch = part.toLowerCase() === query.toLowerCase();

      return isMatch ? (
        <mark key={`${friend.id}-match-${index}`} className="bg-primary-muted text-primary px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <span key={`${friend.id}-part-${index}`}>{part}</span>
      );
    });
  };

  return (
    <GList
      items={friends}
      keyExtractor={(friend) => friend.id}
      noPagination={noPagination}
      emptyIcon={<GIcon icon={UsersRound} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}>
      {(friend) => (
        <GCard
          key={friend.id}
           padding={SizeEnum.sm}
           variant={CardVariantEnum.Outlined}
           rounded={SizeEnum.xl}
          onClick={() => {
            if (!actions) router.push(`/messages?friend=${friend.id}`);
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !actions) {
              e.preventDefault();
              router.push(`/messages?friend=${friend.id}`);
            }
          }}
          role={!actions ? "button" : undefined}
          tabIndex={!actions ? 0 : undefined}
          className={clsx(
            "flex items-center gap-3",
            !actions && "cursor-pointer transition hover:bg-bg-card-hover focus-visible:ring-2 focus-visible:ring-primary",
          )}>
          <div className="relative shrink-0">
            <GAvatar firstName={friend.firstName} lastName={friend.lastName} status={friend.status} size={SizeEnum.sm} shape={AvatarShapeEnum.Circle} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-inherit">{renderHighlightedName(friend)}</h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <span>@{friend.userName}</span>
              {friend.status === UserStatusEnum.InGame && (
                <>
                  <span>•</span>
                  <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
                </>
              )}
            </div>
          </div>

          {unreadCounts?.[friend.id] != null && unreadCounts[friend.id] > 0 && (
            <GBadge variant={AccentColorEnum.Danger} size={SizeEnum.sm} className="shrink-0 min-w-5 justify-center">
              {unreadCounts[friend.id]}
            </GBadge>
          )}

          {actions && <div className="flex gap-2 shrink-0">{actions(friend)}</div>}
        </GCard>
      )}
    </GList>
  );
}
