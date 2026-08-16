"use client";

import { useRef } from "react";

import type { IPingPongGameState } from "@/app/providers/def/IGameState";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { DirectionValues, GameActionTypes, PADDLE_KEYS } from "@/domain/constant/game-actions";
import { INPUT_THROTTLE_MS } from "@/domain/constant/game-constants";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameTranslation } from "@/hooks/useGameTranslation";

const calculatePercentage = (value: number, total: number) => `${(value / total) * 100}%`;

function PingPongPage() {
  const { state } = useGame();
  const { user } = useAuth();
  const t = useGameTranslation();
  const boardRef = useRef<HTMLDivElement>(null);

  const isActive = !!state && "ball" in state && !state.isFinished;

  const resolveDirection = (keys: Set<string>): "UP" | "DOWN" | "LEFT" | "RIGHT" | null => {
    const up = PADDLE_KEYS.UP.intersection(keys).size > 0;
    const down = PADDLE_KEYS.DOWN.intersection(keys).size > 0;
    if (up && down) return null;
    if (up) return DirectionValues.UP;
    if (down) return DirectionValues.DOWN;
    return null;
  };

  useGameInput({
    gameKey: "PING_PONG",
    isActive,
    resolveDirection,
    createAction: (dir) => ({ type: GameActionTypes.MOVE_PADDLE, direction: dir as "UP" | "DOWN" }),
    createPositionAction: (y) => ({ type: GameActionTypes.SET_PADDLE, y }),
    throttleMs: INPUT_THROTTLE_MS.PING_PONG,
    boardRef,
    pointerMode: "drag",
    getCurrentPosition: () => {
      if (!state || !("ball" in state)) return null;
      const pongState = state as IPingPongGameState;
      const isPlayer1 = pongState.player1Id === user?.id;
      const paddle = isPlayer1 ? pongState.player1Paddle : pongState.player2Paddle;
      return { y: paddle.y / pongState.boardHeight, height: paddle.height / pongState.boardHeight };
    },
  });

  if (!state || !("ball" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const { boardWidth, boardHeight, ball, ballSize, player1Paddle, player2Paddle, paddleWidth, score, winScore, isFinished } = pongState;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>
      <GCard padding={SizeEnum.md}>
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{score[0]}</div>
            <div className="text-xs text-text-muted">{t.game.player1}</div>
          </div>
          <div className="text-center text-text-muted font-bold flex flex-col justify-center">
            <span>{t.game.vs}</span>
            <span className="text-xs">{t.game.firstTo.replace("{score}", String(winScore))}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{score[1]}</div>
            <div className="text-xs text-text-muted">{t.game.player2}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div
            ref={boardRef}
            className="relative bg-surface border-2 border-border-light rounded-lg mx-auto w-full max-w-full overflow-hidden touch-none select-none"
            style={{ aspectRatio: boardWidth / boardHeight }}>
            <div
              className="absolute bg-accent rounded"
              style={{
                width: calculatePercentage(paddleWidth, boardWidth),
                height: calculatePercentage(player1Paddle.height, boardHeight),
                left: calculatePercentage(player1Paddle.x, boardWidth),
                top: calculatePercentage(player1Paddle.y, boardHeight),
              }}
            />
            <div
              className="absolute bg-warning rounded"
              style={{
                width: calculatePercentage(paddleWidth, boardWidth),
                height: calculatePercentage(player2Paddle.height, boardHeight),
                left: calculatePercentage(player2Paddle.x, boardWidth),
                top: calculatePercentage(player2Paddle.y, boardHeight),
              }}
            />
            <div
              className={`absolute bg-primary rounded-full ${!isFinished ? "animate-pulse" : ""}`}
              style={{
                width: calculatePercentage(ballSize, boardWidth),
                aspectRatio: "1 / 1",
                left: calculatePercentage(ball.x - ballSize / 2, boardWidth),
                top: calculatePercentage(ball.y - ballSize / 2, boardHeight),
              }}
            />
          </div>
        </div>
        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">{t.pingpong.controlHint}</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
