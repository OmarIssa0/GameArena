import type { INotificationItem } from "@/domain/meta/INotification";

interface INotificationCounters {
  receivedFriendRequests: number;
  sentFriendRequests: number;
  friends: number;
  unreadMessages: number;
}

interface INotificationService {
  requestCounters(): Promise<void>;
  requestNotificationList(limit?: number): Promise<void>;
  markNotificationRead(notificationId: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  onCountersUpdate(handler: (data: INotificationCounters) => void): () => void;
  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void): () => void;
  onNewNotification(handler: (data: INotificationItem) => void): () => void;
  onNotificationList(handler: (data: INotificationItem[]) => void): () => void;
}

export type { INotificationService, INotificationCounters };
