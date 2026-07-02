import type { TNullable } from "@/domain/type/TCommon";

interface IMessage {
  senderId: string;
  receiverId: string;
  content: TNullable<string>;
  sentAt: Date;
  isRead: boolean;
}

export type { IMessage };
