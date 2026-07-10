"use client";

import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { HubConnection } from "@microsoft/signalr";
import type { TNullable } from "@/domain/type/TCommon";

class GameService {
  constructor(private connection: HubConnection) {}
  private static instance: TNullable<GameService> = null;

  async findMatch(gameKind: GamesKindEnum): Promise<void> {
    await this.connection.invoke("FindMatch", gameKind);
  }

  async startGame(friendId: string | null, gameKind: GamesKindEnum): Promise<void> {
    await this.connection.invoke("StartGame", friendId, gameKind);
  }

  async inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void> {
    await this.connection.invoke("InviteFriend", friendId, gameKind);
  }

  async inviteToRoom(friendId: string): Promise<void> {
    await this.connection.invoke("InviteToRoom", friendId);
  }

  async leaveGame(): Promise<void> {
    await this.connection.invoke("LeaveGame");
  }

  async cancelSearch(): Promise<void> {
    await this.connection.invoke("CancelSearch");
  }

  async sendAction(action: object): Promise<void> {
    await this.connection.invoke("SendAction", action);
  }

  async getCurrentState<T>(): Promise<T | null> {
    return this.connection.invoke<T | null>("GetCurrentState");
  }
  static getInstance(connection: HubConnection): GameService {
    if (!this.instance) {
      this.instance = new GameService(connection);
    }
    return this.instance;
  }
}

export { GameService };
