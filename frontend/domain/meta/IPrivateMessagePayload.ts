interface IPrivateMessagePayload {
  senderId: string;
  receiverId: string;
  content?: string | null;
  message?: string | null;
  sentAt: string | Date;
  isRead?: boolean;
}

export type { IPrivateMessagePayload };
