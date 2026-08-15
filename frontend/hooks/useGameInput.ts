"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { PADDLE_KEYS, DIRECTIONS, type TGameAction } from "@/domain/constant/game-actions";
import { SWIPE_THRESHOLD_PX, POSITION_SEND_STEP } from "@/domain/constant/game-constants";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

interface GameInputConfig<T extends HTMLElement = HTMLElement> {
  gameKey: "PING_PONG" | "SNAKE";
  isActive: boolean;
  resolveDirection: (keys: Set<string>) => Direction | null;
  createAction: (direction: Direction) => TGameAction;
  throttleMs: number;
  boardRef?: RefObject<T | null>;
  touchMode?: "swipe" | "follow";

  createPositionAction?: (y: number) => TGameAction;
}

export function useGameInput<T extends HTMLElement>(config: GameInputConfig<T>) {
  const { sendAction } = useGame();
  const keysDown = useRef<Set<string>>(new Set());
  const lastActionRef = useRef<Direction | null>(null);
  const lastSendTimeRef = useRef(0);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    if (!config.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDirectionKey(e.key, config.gameKey)) {
        e.preventDefault();
        keysDown.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isDirectionKey(e.key, config.gameKey)) {
        keysDown.current.delete(e.key);
      }
    };
    const pressed = keysDown.current;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      pressed.clear();
    };
  }, [config.isActive, config.gameKey]);

  useEffect(() => {
    if (!config.isActive) return;

    let rafId: number | null = null;

    const tick = () => {
      const { resolveDirection, createAction, throttleMs } = configRef.current;
      const direction = resolveDirection(keysDown.current);
      const now = Date.now();

      if (direction !== lastActionRef.current) {
        lastActionRef.current = direction;
        if (direction) {
          lastSendTimeRef.current = now;
          sendAction(createAction(direction));
        }
      } else if (direction && now - lastSendTimeRef.current >= throttleMs) {
        lastSendTimeRef.current = now;
        sendAction(createAction(direction));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [config.isActive, sendAction]);

  useEffect(() => {
    const config = configRef.current;
    if (!config.isActive || !config.touchMode || !config.boardRef?.current) return;
    const board = config.boardRef.current;

    const start = { x: 0, y: 0 };
    let touching = false;
    let lastSentY: number | null = null;

    const boardRelativeY = (clientY: number): number => {
      const rect = board.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touching = true;
      start.x = e.touches[0].clientX;
      start.y = e.touches[0].clientY;
      if (config.touchMode !== "follow" || !config.createPositionAction) return;
      lastSentY = boardRelativeY(e.touches[0].clientY);
      lastSendTimeRef.current = Date.now();
      sendAction(config.createPositionAction(lastSentY));
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touching || config.touchMode !== "follow" || !config.createPositionAction) return;
      const touch = e.touches[0];
      if (!touch) return;

      const y = boardRelativeY(touch.clientY);
      if (lastSentY !== null && Math.abs(y - lastSentY) < POSITION_SEND_STEP) return;

      const now = Date.now();
      if (now - lastSendTimeRef.current < config.throttleMs) return;

      lastSentY = y;
      lastSendTimeRef.current = now;
      sendAction(config.createPositionAction(y));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touching) return;
      touching = false;
      if (config.touchMode !== "swipe") return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD_PX) return;

      const direction = swipeDirection(dx, dy);

      const last = lastActionRef.current;
      if (last && direction === OPPOSITE[last]) return;

      lastActionRef.current = direction;
      lastSendTimeRef.current = Date.now();
      sendAction(config.createAction(direction));
    };

    const handleTouchCancel = () => {
      touching = false;
    };

    board.addEventListener("touchstart", handleTouchStart, { passive: true });
    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchend", handleTouchEnd);
    board.addEventListener("touchcancel", handleTouchCancel);
    return () => {
      board.removeEventListener("touchstart", handleTouchStart);
      board.removeEventListener("touchmove", handleTouchMove);
      board.removeEventListener("touchend", handleTouchEnd);
      board.removeEventListener("touchcancel", handleTouchCancel);
      touching = false;
    };
  }, [config.isActive, config.touchMode, config.boardRef, sendAction]);
}

function swipeDirection(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "RIGHT" : "LEFT";
  return dy > 0 ? "DOWN" : "UP";
}

function isDirectionKey(key: string, gameKey: "PING_PONG" | "SNAKE"): boolean {
  if (gameKey === "PING_PONG") {
    return PADDLE_KEYS.UP.has(key) || PADDLE_KEYS.DOWN.has(key);
  }
  const allKeys = Object.values(DIRECTIONS).flat() as string[];
  return allKeys.includes(key);
}
