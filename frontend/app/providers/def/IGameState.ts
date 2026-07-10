import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

// Base interface - common fields for ALL games
export interface IGameStateBase {
  roomId: string;
  player1Id: string;
  player1Username?: string;
  player2Id?: string;
  player2Username?: string;
  hasStarted: boolean;
  isFull: boolean;
  isPrivate: boolean;
  isBotGame: boolean;
  isFinished: boolean;
  currentTurnPlayerId?: string;
  winnerPlayerId?: string;
}

// TicTacToe specific state
export interface ITicTacToeGameState extends IGameStateBase {
  board: string[];
  winnerSymbol?: string;
}

// Snake specific state
export interface ISnakeGameState extends IGameStateBase {
  grid: string[][];
  snakePositions: { x: number; y: number }[];
  foodPosition: { x: number; y: number };
}

// PingPong specific state
export interface IPingPongGameState extends IGameStateBase {
  ballPosition: { x: number; y: number };
  player1PaddleY: number;
  player2PaddleY: number;
  player1Score: number;
  player2Score: number;
}

// Union type - frontend discriminates based on presence of game-specific fields
export type IGameState = ITicTacToeGameState | ISnakeGameState | IPingPongGameState;
