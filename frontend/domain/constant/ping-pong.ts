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
