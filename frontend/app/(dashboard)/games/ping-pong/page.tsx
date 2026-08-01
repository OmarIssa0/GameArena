"use client";

import { useEffect } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GCard } from "@/component/common/GCard";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IPingPongGameState } from "@/app/providers/def/IGameState";
import { PING_PONG_KEYS, PING_PONG_MOVEMENT_ACTIONS } from "@/domain/constant/ping-pong";

const INPUT_SEND_INTERVAL_MS = 50;

function PingPongPage() {
  const { state, sendAction } = useGame();

  const isActive = !!state && "ballPosition" in state && !state.isFinished;

  useEffect(() => {
    if (!isActive) return;

    const keysDown = new Set<string>();
    let currentDir: "UP" | "DOWN" | null = null;
    let repeatInterval: number | null = null;

    const send = (dir: "UP" | "DOWN") => sendAction({ type: PING_PONG_MOVEMENT_ACTIONS.MOVE_PADDLE, direction: dir });

    const sync = () => {
      const up = PING_PONG_KEYS.UP.intersection(keysDown).size > 0;
      const down = PING_PONG_KEYS.DOWN.intersection(keysDown).size > 0;
      const nextDir = up === down ? null : up ? PING_PONG_MOVEMENT_ACTIONS.DIRECTION_UP : PING_PONG_MOVEMENT_ACTIONS.DIRECTION_DOWN;
      if (nextDir === currentDir) return;
      currentDir = nextDir;
      if (repeatInterval !== null) {
        window.clearInterval(repeatInterval);
        repeatInterval = null;
      }
      if (currentDir) {
        send(currentDir);
        repeatInterval = window.setInterval(() => send(currentDir!), INPUT_SEND_INTERVAL_MS);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!PING_PONG_KEYS.ALL.has(e.key)) return;
      e.preventDefault();
      keysDown.add(e.key);
      sync();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.key);
      sync();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (repeatInterval !== null) window.clearInterval(repeatInterval);
    };
  }, [sendAction, isActive]);

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

  const pct = (value: number, total: number) => `${(value / total) * 100}%`;

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
            className="relative bg-surface border-2 border-border-light rounded-lg mx-auto w-full max-w-full overflow-hidden"
            style={{ aspectRatio: boardWidth / boardHeight }}>
            <div
              className="absolute bg-accent rounded"
              style={{
                width: pct(paddleWidth, boardWidth),
                height: pct(player1PaddleHeight, boardHeight),
                left: pct(player1PaddleX, boardWidth),
                top: pct(player1PaddleY, boardHeight),
              }}
            />
            <div
              className="absolute bg-warning rounded"
              style={{
                width: pct(paddleWidth, boardWidth),
                height: pct(player2PaddleHeight, boardHeight),
                left: pct(player2PaddleX, boardWidth),
                top: pct(player2PaddleY, boardHeight),
              }}
            />
            <div
              className={`absolute bg-primary rounded-full ${!isFinished ? "animate-pulse" : ""}`}
              style={{
                width: pct(ballSize, boardWidth),
                aspectRatio: "1 / 1",
                left: pct(ballPosition.x - ballSize / 2, boardWidth),
                top: pct(ballPosition.y - ballSize / 2, boardHeight),
              }}
            />
          </div>
        </div>
        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S or &uarr;/&darr; to move your paddle</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
