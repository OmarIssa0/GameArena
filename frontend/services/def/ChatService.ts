import { SignalRServiceBase } from "../lib/SignalRServiceBase";
import { chatRepository } from "@/repositories/def/ChatRepository";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IPrivateMessagePayload } from "@/domain/meta/IPrivateMessagePayload";
import type { TPromise } from "@/domain/type/TCommon";
import type { IChatService } from "../meta/IChatService";
import type { IPerFriendUnreadCount } from "@/repositories/meta/IChatRepository";
import type { Handler } from "../lib/signalRUtils";

const normalizeMessage = (payload: IPrivateMessagePayload): IMessage => ({
  senderId: payload.senderId,
  receiverId: payload.receiverId,
  content: payload.content ?? payload.message ?? "",
  sentAt: new Date(payload.sentAt),
  isRead: payload.isRead ?? false,
});

class ChatService extends SignalRServiceBase implements IChatService {
  private repo = chatRepository;

  protected registerHandlers(): void {
    this.addHandler("chat:private", (data: unknown) => {
      this.subs.dispatch("chat:private", normalizeMessage(data as IPrivateMessagePayload));
    });
  }

  getMessagesByFriendId(friendId: string): TPromise<IMessage[]> {
    return this.repo.getMessagesByFriendId(friendId);
  }

  getPerFriendUnreadCounts(): TPromise<IPerFriendUnreadCount[]> {
    return this.repo.getPerFriendUnreadCounts();
  }

  async sendMessage(receiverId: string, content: string): Promise<void> {
    await this.requireConnection("Social").invoke("SendPrivateMessage", receiverId, content);
  }

  onPrivateMessage(handler: (message: IMessage) => void): () => void {
    return this.subscribe("chat:private", handler as Handler);
  }
}

export const chatService = new ChatService();
