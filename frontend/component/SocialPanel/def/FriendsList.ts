import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

interface IFriendsListProps {
  friends: IUserSummary[];
  query?: TNullable<string>;
  unreadCounts?: Record<string, number>;
  actions?: (friend: IUserSummary) => React.ReactNode;
  noPagination?: boolean;
}

export type { IFriendsListProps };
