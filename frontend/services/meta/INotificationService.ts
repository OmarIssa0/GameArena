interface INotificationService {
  requestCounters(): Promise<void>;
  onCountersUpdate(handler: (data: { friendRequests: number; unreadMessages: number }) => void): () => void;
  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void): () => void;
}

export type { INotificationService };
