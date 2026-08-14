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
