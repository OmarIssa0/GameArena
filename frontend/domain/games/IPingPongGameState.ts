interface IPingPongGameState {
  roomId: string;
  player1Id: string;
  player1Username: string;
  player2Id?: string;
  player2Username?: string;
  hasStarted: boolean;
  isFull: boolean;
  isPrivate: boolean;
  isBotGame: boolean;
}

export type { IPingPongGameState };
