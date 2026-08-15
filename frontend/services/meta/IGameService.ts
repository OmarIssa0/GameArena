import type { HubConnection } from "@microsoft/signalr";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInvite } from "@/domain/meta/INotification";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { TNullable } from "@/domain/type/TCommon";

interface IGameService {
  findMatch(gameKind: GamesKindEnum): Promise<void>;
  startGame(friendId: TNullable<string>, gameKind: GamesKindEnum): Promise<void>;
  inviteFriend(friendId: string, gameKind: GamesKindEnum): Promise<void>;
  inviteToRoom(friendId: string): Promise<void>;
  leaveGame(): Promise<void>;
  requestPlayAgain(): Promise<void>;
  respondPlayAgain(accept: boolean): Promise<void>;
  cancelSearch(): Promise<void>;
  sendAction(action: object): Promise<void>;
  acceptInvite(roomId: string): Promise<void>;
  createLobby(gameKind: GamesKindEnum): Promise<void>;
  onGameState(handler: (state: IGameState) => void): () => void;
  onOpponentDisconnect(handler: () => void): () => void;
  onGameInvite(handler: (invite: IGameInvite) => void): () => void;
  onPlayAgainRequest(handler: (data: { requesterId: string; requesterUsername: string }) => void): () => void;
  onPlayAgainResponse(handler: (data: { accepted: boolean }) => void): () => void;
  handleReconnect(): void;
  onReconnect(handler: () => void): () => void;
  setConnection(connection: HubConnection): void;
}

export type { IGameService };
