"use client";

import { Check, Loader2, UserCheck, X } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import { useBusyAction } from "@/hooks/useBusyAction";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { IRequestsTabProps } from "./def/FriendsTab";

function RequestsTab({ requests, onAccept, onDecline, t }: IRequestsTabProps) {
  const { run, isBusy, busyClass } = useBusyAction();

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
        const busy = isBusy(friend.id);
        return (
          <div className="flex gap-1">
            <GIcon
              icon={busy ? Loader2 : Check}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-success/10"
              tileColor={AccentColorEnum.Success}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onAccept(friend.id))}
              ariaLabel={t.requestsTab.accept}
            />
            <GIcon
              icon={busy ? Loader2 : X}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onDecline(friend.id))}
              ariaLabel={t.requestsTab.decline}
            />
          </div>
        );
      }}
    />
  );
}

export { RequestsTab };
