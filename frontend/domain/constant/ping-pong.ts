import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

export const PING_PONG_GAME_CONFIG = {
  id: GamesKindEnum.PingPong,
  name: "PingPong",
  description: "pongDesc",
  type: GamesKindEnum.PingPong,
  path: "ping-pong",
  boardWidthPx: 600,
  boardHeightPx: 400,
  paddleWidthPx: 10,
  paddleHeightPx: 80,
  ballSizePx: 10,
  minPlayers: 1,
  maxPlayers: 2,
  reconnectAttempts: 3,
  timeoutMs: 30000,
} as const;

export const PING_PONG_MOVEMENT_ACTIONS = {
  MOVE_PADDLE: "MOVE_PADDLE",
  DIRECTION_UP: "UP",
  DIRECTION_DOWN: "DOWN",
} as const;

export const PING_PONG_KEYS = {
  UP: new Set(["ArrowUp", "w", "W"]),
  DOWN: new Set(["ArrowDown", "s", "S"]),
  ALL: new Set(["ArrowUp", "ArrowDown", "w", "W", "s", "S"]),
} as const;

export type TPingPongDirection = "UP" | "DOWN";
export type TPingPongAction = { type: typeof PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE; direction: TPingPongDirection };
