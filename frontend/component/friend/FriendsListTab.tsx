"use client";

import { useState } from "react";
import { Users, MessageSquare, ShieldBan, UserMinus, Loader2 } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GButton } from "../common/GButton";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import type { FriendsListTabProps } from "./def/FriendsTab";
import type { TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function FriendsListTab({ friends, messageLabel, activeLabel, onMessage, onBlock, onRemove, onAddFriend, t }: FriendsListTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (friends.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Users} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.noFriendsTitle}
        description={t.noFriendsDescription}>
        <GButton onClick={onAddFriend} className="mt-4">
          {t.addFriend}
        </GButton>
      </GEmpty>
    );
  }

  return (
    <FriendsList
      friends={friends}
      messageLabel={messageLabel}
      activeLabel={activeLabel}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon
              icon={MessageSquare}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-primary/10"
              tileColor={AccentColorEnum.Primary}
              onClick={() => onMessage(friend.id)}
              ariaLabel={t.message}
            />
            <GIcon
              icon={isBusy ? Loader2 : ShieldBan}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-warning/10"
              tileColor={AccentColorEnum.Warning}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onBlock(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel="Block"
            />
            <GIcon
              icon={isBusy ? Loader2 : UserMinus}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try {
                  await onRemove(friend.id);
                } finally {
                  setActionId(null);
                }
              }}
              ariaLabel="Remove friend"
            />
          </div>
        );
      }}
    />
  );
}

export { FriendsListTab };
