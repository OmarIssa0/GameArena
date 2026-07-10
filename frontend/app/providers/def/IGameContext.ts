import { TNullable } from "@/domain/type/TCommon";
import { IGameState } from "./IGameState";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IGameContext {
  state: TNullable<IGameState>;
  roomId: TNullable<string>;
  isSearching: boolean;
  isConnected: boolean;
  opponentDisconnected: boolean;
  findMatch(gameKind: GamesKindEnum): Promise<void>;
  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): Promise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void>;
  inviteToRoom(friendId: string): Promise<void>;
  leaveGame(): Promise<void>;
  resetGame(): Promise<void>;
  sendAction(action: object): void;
}

export type { IGameContext };
