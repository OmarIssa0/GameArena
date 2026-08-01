import { gameApi } from "../proxy/game.api";
import type { IGameRepository } from "../meta/IGameRepository";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { TNullable, TPromise } from "@/domain/type/TCommon";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

class GameRepository implements IGameRepository {
  private static instance: GameRepository;
  private api = gameApi.api;
  getCurrentState(): TPromise<TNullable<IGameState>> {
    return this.api.getCurrentState();
  }

  findMatch(gameKind: GamesKindEnum): TPromise<void> {
    return this.api.findMatch({ gameKind });
  }

  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): TPromise<void> {
    return this.api.startGame({ friendId, gameKind });
  }

  inviteFriend(friendId: string, gameKind: GamesKindEnum): TPromise<void> {
    return this.api.inviteFriend({ friendId, gameKind });
  }

  inviteToRoom(friendId: string): TPromise<void> {
    return this.api.inviteToRoom({ friendId });
  }

  leaveGame(): TPromise<void> {
    return this.api.leaveGame();
  }

  requestPlayAgain(): TPromise<void> {
    return this.api.requestPlayAgain();
  }

  respondPlayAgain(accept: boolean): TPromise<void> {
    return this.api.respondPlayAgain({ accept });
  }

  cancelSearch(): TPromise<void> {
    return this.api.cancelSearch();
  }

  sendAction(action: object): TPromise<void> {
    return this.api.sendAction({ action });
  }

  acceptInvite(roomId: string): TPromise<void> {
    return this.api.acceptInvite({ roomId });
  }

  createLobby(gameKind: GamesKindEnum): TPromise<void> {
    return this.api.createLobby({ gameKind });
  }
  static getInstance() {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository();
    }
    return GameRepository.instance;
  }
}

export const gameRepository = GameRepository.getInstance();
