import type { TNullable } from "@/domain/type/TCommon";

interface IGameInvite {
  roomId: string;
  gameType: number;
  inviterId: string;
  inviterName: TNullable<string>;
}

interface INotificationState {
  friendRequestCount: number;
  unreadMessageCount: number;
  gameInvites: IGameInvite[];
  dismissGameInvite: (roomId: string) => void;
  acceptGameInvite: (roomId: string) => Promise<void>;
}

export type { IGameInvite, INotificationState };
