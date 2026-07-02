import type { IFriend } from "@/domain/meta/ICommon";

interface IFriendsListProps {
  friends: IFriend[];
  onSelectFriend: (id: string) => void;
}

export type { IFriendsListProps, IFriend };
