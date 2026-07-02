import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

interface IGameInvite {
  roomId: string;
  gameType: number;
  inviterId: string;
  inviterName: string | null;
}

interface INotificationState {
  friendRequestCount: number;
  unreadMessageCount: number;
  gameInvites: IGameInvite[];
  syncCounts: () => Promise<void>;
  refreshUnreadMessages: () => Promise<void>;
  refreshFriendRequests: () => Promise<void>;
  dismissGameInvite: (roomId: string) => void;
  acceptGameInvite: (roomId: string) => Promise<void>;
}

interface IFriend {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  status: UserStatusEnum;
}

interface IUserFilterRequest {
  name: string | null;
  userStatus: UserStatusEnum;
}

export type { IGameInvite, INotificationState, IFriend, IUserFilterRequest };
