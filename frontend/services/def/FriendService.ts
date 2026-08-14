import { SignalRServiceBase } from "../lib/SignalRServiceBase";
import { friendRepository } from "@/repositories/def/FriendRepository";
import type { HubConnection } from "@microsoft/signalr";
import type { TPromise } from "@/domain/type/TCommon";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendService } from "../meta/IFriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { withFullName } from "@/domain/lib/userUtils";
import type { Handler } from "../lib/signalRUtils";

class FriendService extends SignalRServiceBase implements IFriendService {
  private repo = friendRepository;

  // ── Connection setup (called once by ConnectionProvider) ──────────────

  setConnection(connection: HubConnection): void {
    super.setConnection(connection);
  }

  protected registerHandlers(): void {
    // Batched social data event — replaces individual social:friends, social:requests, social:blocked
    // on initial connect/reconnect to prevent UI flicker
    this.addHandler("social:all", (data: unknown) => {
      const batch = data as {
        friends?: IUserSummary[];
        receivedRequests?: IFriendRequestReceived[];
        sentRequests?: IFriendRequestSent[];
        blockedUsers?: IUserSummary[];
        counters?: { receivedFriendRequests: number; sentFriendRequests: number; friends: number; unreadMessages: number };
      };

      const sortedFriends = (batch.friends ?? []).map(withFullName).sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));
      this.subs.dispatch("social:friends", sortedFriends);
      this.subs.dispatch("social:requests", { received: batch.receivedRequests ?? [], sent: batch.sentRequests ?? [] });
      this.subs.dispatch("social:blocked", (batch.blockedUsers ?? []).map(withFullName));
      this.subs.dispatch(
        "notification:update",
        batch.counters ?? { receivedFriendRequests: 0, sentFriendRequests: 0, friends: 0, unreadMessages: 0 },
      );
    });

    // Legacy individual events — still handled for incremental updates
    this.addHandler("social:friends", (data: unknown) => {
      const list = (data as IUserSummary[]).map(withFullName).sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));
      this.subs.dispatch("social:friends", list);
    });

    this.addHandler("social:requests", (data: unknown) => {
      this.subs.dispatch("social:requests", data);
    });

    this.addHandler("social:blocked", (data: unknown) => {
      this.subs.dispatch("social:blocked", (data as IUserSummary[]).map(withFullName));
    });

    this.addHandler("friend:online", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, UserStatusEnum.Online);
    });

    this.addHandler("friend:offline", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, UserStatusEnum.Offline);
    });

    this.addHandler("friend:ingame", (data: unknown) => {
      this.subs.dispatch("friend:status", (data as { userId: string }).userId, UserStatusEnum.InGame);
    });

    // Informational pushes — the corresponding data refreshes (social:* /
    // notification:*) are pushed by the server alongside these. Registered so
    // SignalR does not log "No client method found" warnings.
    this.addHandler("friend:request", (data: unknown) => this.subs.dispatch("friend:request", data));
    this.addHandler("friend:accepted", (data: unknown) => this.subs.dispatch("friend:accepted", data));
    this.addHandler("friend:declined", (data: unknown) => this.subs.dispatch("friend:declined", data));
    this.addHandler("friend:removed", (data: unknown) => this.subs.dispatch("friend:removed", data));
    this.addHandler("friend:blocked", (data: unknown) => this.subs.dispatch("friend:blocked", data));
    this.addHandler("friend:requestCancelled", (data: unknown) => this.subs.dispatch("friend:requestCancelled", data));
  }

  // ── REST API ─────────────────────────────────────────────────────────

  sendFriendRequest(friendId: string): TPromise<void> {
    return this.repo.sendFriendRequest(friendId);
  }

  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]> {
    return this.repo.getReceivedFriendRequests();
  }

  getSentFriendRequests(): TPromise<IFriendRequestSent[]> {
    return this.repo.getSentFriendRequests();
  }

  async getFriends(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.repo.getFriends(data);
    if (result.data) result.data = result.data.map(withFullName);
    return result;
  }

  acceptFriendRequest(senderId: string): TPromise<void> {
    return this.repo.acceptFriendRequest(senderId);
  }

  rejectFriendRequest(senderId: string): TPromise<void> {
    return this.repo.rejectFriendRequest(senderId);
  }

  cancelFriendRequest(receiverId: string): TPromise<void> {
    return this.repo.cancelFriendRequest(receiverId);
  }

  removeFriend(friendId: string): TPromise<void> {
    return this.repo.removeFriend(friendId);
  }

  blockUser(blockedId: string): TPromise<void> {
    return this.repo.blockUser(blockedId);
  }

  unblockUser(blockedId: string): TPromise<void> {
    return this.repo.unblockUser(blockedId);
  }

  // ── SignalR subscriptions ────────────────────────────────────────────

  onFriendListUpdate(handler: (friends: IUserSummary[]) => void): () => void {
    return this.subscribe("social:friends", handler as Handler);
  }

  onFriendRequestUpdate(handler: (data: { received: IFriendRequestReceived[]; sent: IFriendRequestSent[] }) => void): () => void {
    return this.subscribe("social:requests", handler as Handler);
  }

  onBlockedUsersUpdate(handler: (blocked: IUserSummary[]) => void): () => void {
    return this.subscribe("social:blocked", handler as Handler);
  }

  onFriendStatusChange(handler: (userId: string, status: UserStatusEnum) => void): () => void {
    return this.subscribe("friend:status", handler as Handler);
  }

  // ── SignalR invocations ────────────────────────────────────────────────

  async invokeFriends(): Promise<void> {
    await this.requireConnection("Social").invoke("RequestFriends");
  }

  async invokeFriendRequests(): Promise<void> {
    await this.requireConnection("Social").invoke("RequestFriendRequests");
  }

  async invokeBlocked(): Promise<void> {
    await this.requireConnection("Social").invoke("RequestBlocked");
  }
}

export const friendService = new FriendService();
