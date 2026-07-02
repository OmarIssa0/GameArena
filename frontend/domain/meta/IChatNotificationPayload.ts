interface IChatNotificationPayload {
  senderId: string;
  receiverId: string;
  content?: string | null;
  sentAt: string | Date;
  isRead?: boolean;
}
export type { IChatNotificationPayload };
