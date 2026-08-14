"use client";

import { Loader2, MessageSquare, ShieldBan, UserMinus, Users, UserPlus } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useBusyAction } from "@/hooks/useBusyAction";

import { FriendsList } from "../SocialPanel/FriendsList";
import type { FriendsListTabProps } from "./def/FriendsTab";

function FriendsListTab({ friends, onMessage, onBlock, onRemove, onAddFriend, t }: FriendsListTabProps) {
  const { run, isBusy, busyClass } = useBusyAction();

  if (friends.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Users} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.noFriendsTitle}
        description={t.noFriendsDescription}>
        <GButton onClick={onAddFriend} className="mt-4" startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}>
          {t.addFriend}
        </GButton>
      </GEmpty>
    );
  }

  return (
    <FriendsList
      friends={friends}
      actions={(friend) => {
        const busy = isBusy(friend.id);
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
              icon={busy ? Loader2 : ShieldBan}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-warning/10"
              tileColor={AccentColorEnum.Warning}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onBlock(friend.id))}
              ariaLabel={t.actions.block}
            />
            <GIcon
              icon={busy ? Loader2 : UserMinus}
              size={SizeEnum.md}
              tile
              hover
              tileGradient="bg-danger/10"
              tileColor={AccentColorEnum.Danger}
              className={busyClass(friend.id)}
              onClick={() => run(friend.id, () => onRemove(friend.id))}
              ariaLabel={t.actions.removeFriend}
            />
          </div>
        );
      }}
    />
  );
}

export { FriendsListTab };
