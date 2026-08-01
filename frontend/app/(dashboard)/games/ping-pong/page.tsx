"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GCard } from "@/component/common/GCard";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IPingPongGameState } from "@/app/providers/def/IGameState";
import { PING_PONG_GAME_CONFIG, PING_PONG_KEYS, PING_PONG_MOVEMENT_ACTIONS } from "@/domain/constant/ping-pong";

const {
  boardWidthPx: LOGICAL_W,
  boardHeightPx: LOGICAL_H,
  paddleWidthPx: PADDLE_W_LOGICAL,
  paddleHeightPx: PADDLE_H_LOGICAL,
  ballSizePx: BALL_SIZE_LOGICAL,
} = PING_PONG_GAME_CONFIG;

function PingPongPage() {
  const { state, sendAction } = useGame();
  const { user } = useAuth();

  const keysDown = useRef<Set<string>>(new Set());
  const rafId = useRef<number | null>(null);
  const lastMouseDirectionRef = useRef<"UP" | "DOWN" | null>(null);
  const rafMouseSendRef = useRef<number | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [boardRect, setBoardRect] = useState<DOMRectReadOnly | null>(null);

  const stateRef = useRef(state);
  const userRef = useRef(user);
  const sendActionRef = useRef(sendAction);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    sendActionRef.current = sendAction;
  }, [sendAction]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (PING_PONG_KEYS.ALL.has(e.key)) {
        e.preventDefault();
        keysDown.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key);
    };

    const tick = () => {
      const currentState = stateRef.current;
      const currentUser = userRef.current;

      if (!currentState || !currentUser) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }

      if (!currentState.isFinished && keysDown.current.size > 0) {
        const hasUpKey = PING_PONG_KEYS.UP.intersection(keysDown.current).size > 0;
        const hasDownKey = PING_PONG_KEYS.DOWN.intersection(keysDown.current).size > 0;

        if (hasUpKey && !hasDownKey) {
          sendActionRef.current({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: PING_PONG_MOVEMENT_ACTIONS.DIRECTION_UP });
        } else if (hasDownKey && !hasUpKey) {
          sendActionRef.current({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: PING_PONG_MOVEMENT_ACTIONS.DIRECTION_DOWN });
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const keysDownCopy = keysDown.current;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      keysDownCopy.clear();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Track board size with ResizeObserver
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBoardRect(entry.contentRect);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse/Pointer control
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current || !userRef.current) return;

      const ppState = stateRef.current as IPingPongGameState;
      const currentUser = userRef.current;
      if (ppState.isFinished) return;

      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const clampedY = Math.max(0, Math.min(rect.height, y));

      const isPlayer1 = ppState.player1Id === currentUser.id;
      const paddleYBackend = isPlayer1 ? ppState.player1PaddleY : ppState.player2PaddleY;

      const pointerBackendY = (clampedY / rect.height) * LOGICAL_H;
      const dir: "UP" | "DOWN" = pointerBackendY < paddleYBackend ? PING_PONG_MOVEMENT_ACTIONS.DIRECTION_UP : PING_PONG_MOVEMENT_ACTIONS.DIRECTION_DOWN;

      lastMouseDirectionRef.current = dir;

      if (rafMouseSendRef.current != null) return;
      rafMouseSendRef.current = requestAnimationFrame(() => {
        rafMouseSendRef.current = null;
        sendActionRef.current({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: dir });
      });
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      if (rafMouseSendRef.current != null) cancelAnimationFrame(rafMouseSendRef.current);
    };
  }, []);

  if (!state || !("ballPosition" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const { ballPosition, player1PaddleY, player2PaddleY, player1Score, player2Score, isFinished } = pongState;

  const scaleX = boardRect ? boardRect.width / LOGICAL_W : 1;
  const scaleY = boardRect ? boardRect.height / LOGICAL_H : 1;

  const paddleW = PADDLE_W_LOGICAL * scaleX;
  const paddleH = PADDLE_H_LOGICAL * scaleY;
  const ballSize = BALL_SIZE_LOGICAL * Math.min(scaleX, scaleY);

  const rawBallLeft = ballPosition.x * scaleX;
  const rawBallTop = ballPosition.y * scaleY;

  const ballLeft = Math.max(0, Math.min(rawBallLeft - ballSize / 2, (boardRect?.width ?? LOGICAL_W) - ballSize));
  const ballTop = Math.max(0, Math.min(rawBallTop - ballSize / 2, (boardRect?.height ?? LOGICAL_H) - ballSize));

  const p1Top = Math.max(0, Math.min(player1PaddleY * scaleY, (boardRect?.height ?? LOGICAL_H) - paddleH));
  const p2Top = Math.max(0, Math.min(player2PaddleY * scaleY, (boardRect?.height ?? LOGICAL_H) - paddleH));

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>
      <GCard padding={SizeEnum.md} rounded={SizeEnum.lg}>
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{player1Score}</div>
            <div className="text-xs text-text-muted">Player 1</div>
          </div>
          <div className="text-center text-text-muted font-bold">-</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{player2Score}</div>
            <div className="text-xs text-text-muted">Player 2</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={boardRef}
            className="relative bg-surface border-2 border-border-light rounded-lg mx-auto w-full max-w-full overflow-hidden"
            style={{ aspectRatio: boardRect && boardRect.width > boardRect.height ? "3/2" : "2/3" }}>
            <div className="absolute inset-y-0 start-1/2 w-px border-s-2 border-dashed border-border opacity-50" />

            <div className="absolute start-[2px] bg-accent rounded" style={{ width: paddleW, height: paddleH, top: p1Top }} />
            <div className="absolute end-[2px] bg-warning rounded" style={{ width: paddleW, height: paddleH, top: p2Top }} />

            <div
              className={clsx("absolute bg-primary rounded-full", !isFinished && "animate-pulse")}
              style={{ width: ballSize, height: ballSize, insetInlineStart: ballLeft, top: ballTop }}
            />
          </div>
        </div>

        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S or &uarr;/&darr; to move your paddle</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
