export const GameActionTypes = {
  MOVE_PADDLE: "MOVE_PADDLE",
  CHANGE_DIRECTION: "CHANGE_DIRECTION",
  MAKE_MOVE: "MAKE_MOVE",
  PLACE: "place",
} as const;

export const DirectionValues = {
  UP: "UP",
  DOWN: "DOWN",
} as const;

export type TGameAction =
  | { type: typeof GameActionTypes.MOVE_PADDLE; direction: "UP" | "DOWN" }
  | { type: typeof GameActionTypes.CHANGE_DIRECTION; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" }
  | { type: typeof GameActionTypes.MAKE_MOVE; choice?: string; cell?: number }
  | { type: typeof GameActionTypes.PLACE; col: number };

const DIRECTION_KEYS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", string[]> = {
  UP: ["ArrowUp", "w", "W"],
  DOWN: ["ArrowDown", "s", "S"],
  LEFT: ["ArrowLeft", "a", "A"],
  RIGHT: ["ArrowRight", "d", "D"],
};

export const PADDLE_KEYS = {
  UP: new Set(DIRECTION_KEYS.UP),
  DOWN: new Set(DIRECTION_KEYS.DOWN),
} as const;

export const DIRECTIONS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", string[]> = DIRECTION_KEYS;
