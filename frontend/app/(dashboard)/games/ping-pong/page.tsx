"use client";

import clsx from "clsx";
import { useGame } from "@/app/providers/GameProvider";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IPingPongGameState } from "@/app/providers/def/IGameState";

function PingPongPage() {
  const { state } = useGame();

  // GameLayoutWrapper handles all stages - we only render board when state has game-specific fields
  if (!state || !("ballPosition" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const ballPosition = pongState.ballPosition;
  const player1PaddleY = pongState.player1PaddleY;
  const player2PaddleY = pongState.player2PaddleY;
  const player1Score = pongState.player1Score;
  const player2Score = pongState.player2Score;
  const isFinished = pongState.isFinished;

  const boardWidth = 600;
  const boardHeight = 400;
  const paddleWidth = 10;
  const paddleHeight = 80;
  const ballSize = 10;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>
      <div className="bg-bg-card border border-border rounded-3xl p-5">
        {/* Score display */}
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

        {/* Game canvas */}
        <div className="relative bg-surface border-2 border-border-light rounded-lg mx-auto" style={{ width: boardWidth, height: boardHeight }}>
          {/* Center line */}
          <div className="absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed border-border opacity-50" />

          {/* Player 1 paddle (left) */}
          <div
            className="absolute left-2 bg-accent rounded"
            style={{
              width: paddleWidth,
              height: paddleHeight,
              top: player1PaddleY,
            }}
          />

          {/* Player 2 paddle (right) */}
          <div
            className="absolute right-2 bg-warning rounded"
            style={{
              width: paddleWidth,
              height: paddleHeight,
              top: player2PaddleY,
            }}
          />

          {/* Ball */}
          <div
            className={clsx("absolute bg-primary rounded-full", !isFinished && "animate-pulse")}
            style={{
              width: ballSize,
              height: ballSize,
              left: ballPosition.x,
              top: ballPosition.y,
            }}
          />
        </div>

        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S or ↑/↓ to move your paddle</div>}
      </div>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
