"use client";

import { useState } from "react";
import { Check, Loader2, UserCheck, X } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { RequestsTabProps } from "./def/FriendsTab";

function RequestsTab({ requests, onAccept, onDecline, t }: RequestsTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (requests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={UserCheck} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.requestsTab.emptyTitle}
        description={t.requestsTab.emptyDescription}
      />
    );
  }

  const friends: IUserSummary[] = requests.map((r) => ({
    id: r.senderId,
    firstName: r.senderFirstName,
    lastName: r.senderLastName,
    userName: r.senderUserName,
    fullName: [r.senderFirstName, r.senderLastName].filter(Boolean).join(" ") || r.senderUserName || r.senderId,
  }));

  return (
    <FriendsList
      friends={friends}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon
              icon={isBusy ? Loader2 : Check}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-success/10"
              tileColor={AccentColorEnum.Success}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onAccept(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel={t.requestsTab.accept}
            />
            <GIcon
              icon={isBusy ? Loader2 : X}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onDecline(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel={t.requestsTab.decline}
            />
          </div>
        );
      }}
    />
  );
}

export { RequestsTab };
