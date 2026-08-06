"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { PADDLE_KEYS, DIRECTIONS, type TGameAction } from "@/domain/constant/game-actions";

interface GameInputConfig {
  gameKey: "PING_PONG" | "SNAKE";
  isActive: boolean;
  resolveDirection: (keys: Set<string>) => "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
  createAction: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => TGameAction;
  throttleMs: number;
}

export function useGameInput(config: GameInputConfig) {
  const { sendAction } = useGame();
  const keysDown = useRef<Set<string>>(new Set());
  const lastActionRef = useRef<"UP" | "DOWN" | "LEFT" | "RIGHT" | null>(null);
  const lastSendRef = useRef(0);

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [config.isActive, config.gameKey]);

  useEffect(() => {
    const { isActive, resolveDirection, createAction, throttleMs } = config;
    if (!isActive) return;

    let rafId: number | null = null;

    const tick = () => {
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
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [config.isActive, config.resolveDirection, config.createAction, config.throttleMs, config, sendAction]);
}

function isDirectionKey(key: string, gameKey: "PING_PONG" | "SNAKE"): boolean {
  if (gameKey === "PING_PONG") {
    return PADDLE_KEYS.UP.has(key) || PADDLE_KEYS.DOWN.has(key);
  }
  const allKeys = Object.values(DIRECTIONS).flat() as string[];
  return allKeys.includes(key);
}