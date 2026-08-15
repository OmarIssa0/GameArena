"use client";

import { Loader2, ShieldBan } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useBusyAction } from "@/hooks/useBusyAction";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { IBlockedUsersTabProps } from "./def/FriendsTab";

function BlockedUsersTab({ blockedUsers, onUnblock, t }: IBlockedUsersTabProps) {
  const { run, isBusy, busyClass } = useBusyAction();

  if (blockedUsers.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={ShieldBan} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.blockedTab.emptyTitle}
        description={t.blockedTab.emptyDescription}
      />
    );
  }

  return (
    <FriendsList
      friends={blockedUsers}
      actions={(friend) => {
        const busy = isBusy(friend.id);
        return (
          <div className="flex gap-1">
            <GIcon
              icon={busy ? Loader2 : ShieldBan}
              size={SizeEnum.md}
              tile
              tileGradient="bg-success/10"
              tileColor={AccentColorEnum.Success}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onUnblock(friend.id))}
              ariaLabel={t.blockedTab.unblock}
            />
          </div>
        );
      }}
    />
  );
}

export { BlockedUsersTab };
