"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GCard } from "@/component/common/GCard";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IPingPongGameState } from "@/app/providers/def/IGameState";
import { PING_PONG_KEYS, PING_PONG_MOVEMENT_ACTIONS } from "@/domain/constant/ping-pong";

const INPUT_SEND_INTERVAL_MS = 50;
const POINTER_DEAD_ZONE_PX = 8;

function PingPongPage() {
  const { state, sendAction } = useGame();
  const { user } = useAuth();

  const keysDown = useRef<Set<string>>(new Set());
  const rafId = useRef<number | null>(null);
  const lastInputSentAtRef = useRef(0);
  const lastDirRef = useRef<"UP" | "DOWN" | null>(null);
  const lastPointerBackendYRef = useRef<number | null>(null);

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

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    setBoardRect(el.getBoundingClientRect());
  }, []);

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
      if (!currentState || !currentUser || currentState.isFinished) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }
      const ppState = currentState as IPingPongGameState;

      let dir: "UP" | "DOWN" | null = null;
      const hasUpKey = PING_PONG_KEYS.UP.intersection(keysDown.current).size > 0;
      const hasDownKey = PING_PONG_KEYS.DOWN.intersection(keysDown.current).size > 0;
      if (hasUpKey && !hasDownKey) {
        dir = PING_PONG_MOVEMENT_ACTIONS.DIRECTION_UP;
      } else if (hasDownKey && !hasUpKey) {
        dir = PING_PONG_MOVEMENT_ACTIONS.DIRECTION_DOWN;
      } else if (lastPointerBackendYRef.current != null) {
        const isPlayer1 = ppState.player1Id === currentUser.id;
        const paddleYBackend = isPlayer1 ? ppState.player1PaddleY : ppState.player2PaddleY;
        const paddleHBackend = isPlayer1 ? ppState.player1PaddleHeight : ppState.player2PaddleHeight;
        const paddleCenter = paddleYBackend + paddleHBackend / 2;
        const diff = lastPointerBackendYRef.current - paddleCenter;
        if (Math.abs(diff) > POINTER_DEAD_ZONE_PX) {
          dir = diff < 0 ? PING_PONG_MOVEMENT_ACTIONS.DIRECTION_UP : PING_PONG_MOVEMENT_ACTIONS.DIRECTION_DOWN;
        }
      }

      const now = performance.now();
      if (dir !== lastDirRef.current) {
        lastDirRef.current = dir;
        if (dir) {
          lastInputSentAtRef.current = now;
          sendActionRef.current({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: dir });
        }
      } else if (dir && now - lastInputSentAtRef.current >= INPUT_SEND_INTERVAL_MS) {
        lastInputSentAtRef.current = now;
        sendActionRef.current({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: dir });
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
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setBoardRect(el.getBoundingClientRect());
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current || !userRef.current) return;
      const ppState = stateRef.current as IPingPongGameState;
      if (ppState.isFinished) return;
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const clampedY = Math.max(0, Math.min(rect.height, y));
      lastPointerBackendYRef.current = (clampedY / rect.height) * ppState.boardHeight;
    };
    const handlePointerLeave = () => {
      lastPointerBackendYRef.current = null;
    };
    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  if (!state || !("ballPosition" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const {
    boardWidth,
    boardHeight,
    ballPosition,
    ballSize,
    player1PaddleX,
    player1PaddleY,
    player1PaddleHeight,
    player2PaddleX,
    player2PaddleY,
    player2PaddleHeight,
    paddleWidth,
    player1Score,
    player2Score,
    isFinished,
  } = pongState;

  const scaleX = boardRect ? boardRect.width / boardWidth : 1;
  const scaleY = boardRect ? boardRect.height / boardHeight : 1;

  const paddleW = paddleWidth * scaleX;
  const paddleH1 = player1PaddleHeight * scaleY;
  const paddleH2 = player2PaddleHeight * scaleY;
  const ballSizePx = ballSize * Math.min(scaleX, scaleY);

  const ballCenterX = ballPosition.x * scaleX;
  const ballCenterY = ballPosition.y * scaleY;
  const p1Top = player1PaddleY * scaleY;
  const p1Left = player1PaddleX * scaleX;
  const p2Top = player2PaddleY * scaleY;
  const p2Left = player2PaddleX * scaleX;

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
            style={{ aspectRatio: boardWidth / boardHeight }}>
            <div className="absolute inset-y-0 left-1/2 w-px -ml-px border-l-2 border-dashed border-border opacity-50" />
            <div className="absolute bg-accent rounded" style={{ width: paddleW, height: paddleH1, left: p1Left, top: p1Top }} />
            <div className="absolute bg-warning rounded" style={{ width: paddleW, height: paddleH2, left: p2Left, top: p2Top }} />
            <div
              className={`absolute bg-primary rounded-full ${!isFinished ? "animate-pulse" : ""}`}
              style={{ width: ballSizePx, height: ballSizePx, left: ballCenterX - ballSizePx / 2, top: ballCenterY - ballSizePx / 2 }}
            />
          </div>
        </div>
        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S, &uarr;/&darr; or your mouse to move your paddle</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
