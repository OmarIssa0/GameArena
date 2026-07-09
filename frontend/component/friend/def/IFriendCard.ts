import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface IFriendCardProps {
  user: IUserSummary;
  onMessage: () => void;
  onInvite: () => void;
}

export type { IFriendCardProps };
