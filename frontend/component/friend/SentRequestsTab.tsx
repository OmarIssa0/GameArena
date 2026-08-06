"use client";

import { useState } from "react";
import { Loader2, Send, X } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { SentRequestsTabProps } from "./def/FriendsTab";

function SentRequestsTab({ sentRequests, onCancel, t }: SentRequestsTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (sentRequests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Send} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.sentTab.emptyTitle}
        description={t.sentTab.emptyDescription}
      />
    );
  }

  const friends: IUserSummary[] = sentRequests.map((r) => ({
    id: r.receiverId,
    firstName: r.receiverFirstName,
    lastName: r.receiverLastName,
    userName: r.receiverUserName,
    fullName: [r.receiverFirstName, r.receiverLastName].filter(Boolean).join(" ") || r.receiverUserName || r.receiverId,
  }));

  return (
    <FriendsList
      friends={friends}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon
              icon={isBusy ? Loader2 : X}
              size={SizeEnum.sm}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onCancel(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel={t.sentTab.cancel}
            />
          </div>
        );
      }}
    />
  );
}

export { SentRequestsTab };
