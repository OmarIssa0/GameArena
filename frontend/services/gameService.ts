"use client";

import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { HubConnection } from "@microsoft/signalr";

class GameService {
  constructor(private connection: HubConnection) {}

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
}

export { GameService };
