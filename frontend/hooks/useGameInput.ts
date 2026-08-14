"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { PADDLE_KEYS, DIRECTIONS, type TGameAction } from "@/domain/constant/game-actions";
import { SWIPE_THRESHOLD_PX, DRAG_THRESHOLD_PX } from "@/domain/constant/game-constants";

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
  touchMode?: "swipe" | "drag";
}

export function useGameInput<T extends HTMLElement>(config: GameInputConfig<T>) {
  const { sendAction } = useGame();
  const keysDown = useRef<Set<string>>(new Set());
  const lastActionRef = useRef<Direction | null>(null);
  const lastSendRef = useRef(0);
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
          lastSendRef.current = now;
          sendAction(createAction(direction));
        }
      } else if (direction && now - lastSendRef.current >= throttleMs) {
        lastSendRef.current = now;
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
    const cfg = configRef.current;
    if (!cfg.isActive || !cfg.touchMode || !cfg.boardRef?.current) return;
    const board = cfg.boardRef.current;

    const start = { x: 0, y: 0, yLast: 0 };
    let touching = false;

    const handlePointerDown = (e: PointerEvent) => {
      touching = true;
      start.x = e.clientX;
      start.y = e.clientY;
      start.yLast = e.clientY;
      if (cfg.touchMode === "drag") board.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!touching || cfg.touchMode !== "drag") return;

      const dy = e.clientY - start.yLast;
      if (Math.abs(dy) < DRAG_THRESHOLD_PX) return;

      start.yLast = e.clientY;
      const now = Date.now();
      if (now - lastSendRef.current < cfg.throttleMs) return;

      lastSendRef.current = now;
      sendAction(cfg.createAction(dy > 0 ? "DOWN" : "UP"));
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!touching) return;
      touching = false;
      if (cfg.touchMode === "drag") return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD_PX) return;

      const direction: Direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "RIGHT" : "LEFT") : (dy > 0 ? "DOWN" : "UP");

      const last = lastActionRef.current;
      if (last && direction === OPPOSITE[last]) return;

      lastActionRef.current = direction;
      lastSendRef.current = Date.now();
      sendAction(cfg.createAction(direction));
    };

    const handlePointerCancel = (e: PointerEvent) => {
      if (!touching) return;
      touching = false;
      if (cfg.touchMode === "drag" && board.hasPointerCapture(e.pointerId)) {
        board.releasePointerCapture(e.pointerId);
      }
    };

    board.addEventListener("pointerdown", handlePointerDown);
    board.addEventListener("pointermove", handlePointerMove);
    board.addEventListener("pointerup", handlePointerUp);
    board.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      board.removeEventListener("pointerdown", handlePointerDown);
      board.removeEventListener("pointermove", handlePointerMove);
      board.removeEventListener("pointerup", handlePointerUp);
      board.removeEventListener("pointercancel", handlePointerCancel);
      touching = false;
    };
  }, [config.isActive, config.touchMode, config.boardRef, sendAction]);
}

function isDirectionKey(key: string, gameKey: "PING_PONG" | "SNAKE"): boolean {
  if (gameKey === "PING_PONG") {
    return PADDLE_KEYS.UP.has(key) || PADDLE_KEYS.DOWN.has(key);
  }
  const allKeys = Object.values(DIRECTIONS).flat() as string[];
  return allKeys.includes(key);
}
