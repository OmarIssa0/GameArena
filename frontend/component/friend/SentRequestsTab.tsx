"use client";

import { Loader2, Send, X } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import { useBusyAction } from "@/hooks/useBusyAction";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { ISentRequestsTabProps } from "./def/FriendsTab";

function SentRequestsTab({ sentRequests, onCancel, t }: ISentRequestsTabProps) {
  const { run, isBusy, busyClass } = useBusyAction();

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
        const busy = isBusy(friend.id);
        return (
          <div className="flex gap-1">
            <GIcon
              icon={busy ? Loader2 : X}
              size={SizeEnum.sm}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onCancel(friend.id))}
              ariaLabel={t.sentTab.cancel}
            />
          </div>
        );
      }}
    />
  );
}

export { SentRequestsTab };
