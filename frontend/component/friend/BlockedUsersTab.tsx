"use client";

import { useState } from "react";
import { Loader2, ShieldBan } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable } from "@/domain/type/TCommon";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { BlockedUsersTabProps } from "./def/FriendsTab";

function BlockedUsersTab({ blockedUsers, onUnblock, t }: BlockedUsersTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

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
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon
              icon={isBusy ? Loader2 : ShieldBan}
              size={SizeEnum.md}
              tile
              tileGradient="bg-success/10"
              tileColor={AccentColorEnum.Success}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onUnblock(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel={t.blockedTab.unblock}
            />
          </div>
        );
      }}
    />
  );
}

export { BlockedUsersTab };
