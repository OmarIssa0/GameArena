export const GameActionTypes = {
  MOVE_PADDLE: "MOVE_PADDLE",
  CHANGE_DIRECTION: "CHANGE_DIRECTION",
  MAKE_MOVE: "MAKE_MOVE",
  PLACE: "place",
} as const;

export const DirectionValues = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;

export type TPaddleAction = { type: typeof GameActionTypes.MOVE_PADDLE; direction: "UP" | "DOWN" };
export type TDirectionAction = { type: typeof GameActionTypes.CHANGE_DIRECTION; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" };
export type TMakeMoveAction = { type: typeof GameActionTypes.MAKE_MOVE; choice?: string; cell?: number };
export type TPlaceAction = { type: typeof GameActionTypes.PLACE; col: number };
export type TGameAction = TPaddleAction | TDirectionAction | TMakeMoveAction | TPlaceAction;

export const PADDLE_KEYS = {
  UP: new Set(["ArrowUp", "w", "W"]),
  DOWN: new Set(["ArrowDown", "s", "S"]),
} as const;

export const DIRECTIONS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", string[]> = {
  UP: ["ArrowUp", "w", "W"],
  DOWN: ["ArrowDown", "s", "S"],
  LEFT: ["ArrowLeft", "a", "A"],
  RIGHT: ["ArrowRight", "d", "D"],
} as const;
