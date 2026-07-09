import type { TNullable } from "@/domain/type/TCommon";

interface IChatNotificationPayload {
  senderId: string;
  receiverId: string;
  content?: TNullable<string>;
  sentAt: string | Date;
  isRead?: boolean;
}
export type { IChatNotificationPayload };
