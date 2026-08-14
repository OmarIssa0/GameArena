"use client";

import clsx from "clsx";

import { useAuth } from "@/app/providers/AuthProvider";
import type { ISnakeGameState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { DIRECTIONS, GameActionTypes } from "@/domain/constant/game-actions";
import { INPUT_THROTTLE_MS } from "@/domain/constant/game-constants";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { ICellProps, IGameBoardProps } from "./def/SnakeBoard";

const CELL_STYLES: Record<number, string> = {
  0: "bg-surface border border-border-light",
  1: "bg-accent border border-accent",
  2: "bg-primary border border-primary",
  3: "bg-warning border border-warning",
};

function SnakePage() {
  const { state } = useGame();
  const { user } = useAuth();
  const t = useGameTranslation();

  const isSnake = !!state && "player1Snake" in state;
  const isActive = isSnake && !(state as ISnakeGameState).isFinished;

  const resolveDirection = (keys: Set<string>): "UP" | "DOWN" | "LEFT" | "RIGHT" | null => {
    let pressed: "UP" | "DOWN" | "LEFT" | "RIGHT" | null = null;
    for (const d of ["UP", "DOWN", "LEFT", "RIGHT"] as const) {
      if (DIRECTIONS[d].some((k) => keys.has(k))) {
        if (pressed) return null;
        pressed = d;
      }
    }
    return pressed;
  };

  useGameInput({
    gameKey: "SNAKE",
    isActive,
    resolveDirection,
    createAction: (dir) => ({ type: GameActionTypes.CHANGE_DIRECTION, direction: dir }),
    throttleMs: INPUT_THROTTLE_MS.SNAKE,
  });

  if (!state || !isSnake) {
    return <GameLayoutWrapper gameType={GamesKindEnum.Snake}>{null}</GameLayoutWrapper>;
  }

  const snakeState = state as ISnakeGameState;
  const myPlayerId = user?.id;
  const isPlayer1 = snakeState.player1Id === myPlayerId;

  const mySnake = isPlayer1 ? snakeState.player1Snake : snakeState.player2Snake;
  const oppSnake = isPlayer1 ? snakeState.player2Snake : snakeState.player1Snake;
  const myScore = isPlayer1 ? snakeState.player1Score : snakeState.player2Score;
  const oppScore = isPlayer1 ? snakeState.player2Score : snakeState.player1Score;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.Snake}>
      <GCard padding={SizeEnum.md}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-sm text-text-muted">{t.game.you}</div>
            <div className="text-2xl font-bold text-accent">{myScore}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-text-muted">{t.game.opponent}</div>
            <div className="text-2xl font-bold text-warning">{oppScore}</div>
          </div>
        </div>

        <div
          className="relative rounded border border-border-light overflow-hidden"
          style={{ aspectRatio: `${snakeState.boardWidth} / ${snakeState.boardHeight}` }}>
          <GameBoard
            boardWidth={snakeState.boardWidth}
            boardHeight={snakeState.boardHeight}
            mySnake={mySnake}
            oppSnake={oppSnake}
            food={snakeState.food}
          />
        </div>

        {!snakeState.isFinished && <p className="mt-4 text-center text-xs text-text-muted">{t.snake.arrowKeysHint}</p>}
      </GCard>
    </GameLayoutWrapper>
  );
}

function GameBoard({ boardWidth, boardHeight, mySnake, oppSnake, food }: IGameBoardProps) {
  const grid = new Array(boardHeight).fill(0).map(() => new Array(boardWidth).fill(0));
  const inBounds = (p: { x: number; y: number }) => p.x >= 0 && p.x < boardWidth && p.y >= 0 && p.y < boardHeight;

  mySnake.forEach((s) => {
    if (inBounds(s)) grid[s.y][s.x] = 1;
  });
  oppSnake.forEach((s) => {
    if (inBounds(s)) grid[s.y][s.x] = 2;
  });
  if (inBounds(food)) grid[food.y][food.x] = 3;

  return (
    <div
      dir="ltr"
      className="absolute inset-0 grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
        gridTemplateRows: `repeat(${boardHeight}, 1fr)`,
      }}>
      {grid.map((row, y) => row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell as 0 | 1 | 2 | 3} />))}
    </div>
  );
}

function Cell({ type }: ICellProps) {
  return <div className={clsx("w-full h-full", CELL_STYLES[type])} />;
}

export default SnakePage;

