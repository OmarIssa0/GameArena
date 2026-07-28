import type { TNullable, TPromise } from "@/domain/type/TCommon";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameAction } from "@/domain/meta/IGameAction";

export interface IGameRepository {
  getCurrentState(): TPromise<TNullable<IGameState>>;
  findMatch(gameKind: GamesKindEnum): TPromise<void>;
  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): TPromise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): TPromise<void>;
  inviteToRoom(friendId: string): TPromise<void>;
  leaveGame(): TPromise<void>;
  requestPlayAgain(): TPromise<void>;
  respondPlayAgain(accept: boolean): TPromise<void>;
  cancelSearch(): TPromise<void>;
  sendAction(action: IGameAction): TPromise<void>;
  acceptInvite(roomId: string): TPromise<void>;
  createLobby(gameKind: GamesKindEnum): TPromise<void>;
}
