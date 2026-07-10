"use client";

import clsx from "clsx";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import type { ITicTacToeGameState } from "@/app/providers/def/IGameState";

function TicTacToePage() {
  const { user } = useAuth();
  const { state, sendAction } = useGame();

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>{null}</GameLayoutWrapper>;
  }

  const tttState = state as ITicTacToeGameState;
  const myPlayerId = user?.id;
  const board = tttState.board;
  const isMyTurn = tttState.currentTurnPlayerId === myPlayerId;
  const isFinished = tttState.isFinished;

  const handleCellClick = (index: number) => {
    if (isFinished || !isMyTurn) return;
    if (board[index] === "X" || board[index] === "O") return;
    sendAction({ type: "MAKE_MOVE", cell: index });
  };

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>
      <div className="grid grid-cols-3 gap-3 bg-bg-card border border-border rounded-3xl p-5">
        {board.map((cell, i) => {
          const isCellActive = cell !== "X" && cell !== "O" && isMyTurn && !isFinished;
          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={!isCellActive}
              className={clsx(
                "aspect-square flex items-center justify-center text-4xl font-bold border-2 rounded-md transition-colors duration-150",
                cell === "X"
                  ? "text-accent bg-accent-muted border-accent/40"
                  : cell === "O"
                    ? "text-warning bg-warning-bg border-warning/40"
                    : "bg-surface border-border-light hover:border-primary/40 hover:bg-primary-muted cursor-pointer",
              )}>
              {cell === "X" && <span className="text-accent">X</span>}
              {cell === "O" && <span className="text-warning">O</span>}
            </button>
          );
        })}
      </div>
    </GameLayoutWrapper>
  );
}

export default TicTacToePage;
