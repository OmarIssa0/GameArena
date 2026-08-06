// Game board dimensions
export const BOARD_DIMENSIONS = {
  PING_PONG: { width: 600, height: 400 },
  SNAKE: { width: 30, height: 20 },
  TIC_TAC_TOE: { width: 3, height: 3 },
} as const;

// Paddle dimensions (pixels)
export const PADDLE_DIMENSIONS = {
  PING_PONG: { width: 12, height: 80 },
} as const;

// Ball dimensions (pixels)
export const BALL_DIMENSIONS = {
  PING_PONG: { size: 12 },
} as const;

// Input throttling (ms)
export const INPUT_THROTTLE_MS = {
  PING_PONG: 16, // ~60 FPS
  SNAKE: 100, // 10 ticks/sec
} as const;

// Play-again request window (ms)
export const PLAY_AGAIN_TIMEOUT_MS = 30000;

// Rock Paper Scissors constants
export const RPS_CHOICES = ["Rock", "Paper", "Scissors"] as const;

export const RPS_CHOICE_EMOJI: Record<string, string> = {
  Rock: "✊",
  Paper: "✋",
  Scissors: "✌️",
};
