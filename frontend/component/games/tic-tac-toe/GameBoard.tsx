"use client";

import { Zap } from "lucide-react";
import clsx from "clsx";
import { GButton } from "@/component/common/GButton";
import { PlayerCard } from "./PlayerCard";
import { GameResult } from "./GameResult";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";
import type { TicTacToeTranslations } from "@/app/(dashboard)/tic-tac-toe/i18n/en.i18n";

interface GameBoardProps {
  board: string[];
  gameState: TNullable<ITicTacToeGameState>;
  user: TNullable<{ id: string; userName?: TNullable<string> }>;
  isMyTurn: boolean;
  isBotGame: boolean;
  opponentDisconnected: boolean;
  myName: string;
  opponentName: string;
  t: TicTacToeTranslations;
  onCellClick: (index: number) => void;
  onPlayAgain: () => void;
  onLobby: () => void;
  onLeave: () => void;
}

function GameBoard({ board, gameState, user, isMyTurn, isBotGame, opponentDisconnected, myName, opponentName, t, onCellClick, onPlayAgain, onLobby, onLeave }: GameBoardProps) {
  if (!gameState) return null;

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="grid grid-cols-7 items-center bg-bg-card border border-border rounded-lg p-4">
        <PlayerCard
          playerId={gameState.player1Id}
          playerUsername={gameState.player1Username}
          symbol="X"
          isActive={gameState.currentTurnPlayerId === gameState.player1Id && !gameState.isFinished}
          isBot={isBotGame && gameState.player1Id !== user?.id}
          isYou={gameState.player1Id === user?.id}
          myName={myName}
          fallbackName={t.game.player1}
          gameState={gameState}
        />
        <div className="col-span-1 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-text-muted">VS</span>
          <div className="w-px h-10 bg-border/40 mt-1" />
        </div>
        <PlayerCard
          playerId={gameState.player2Id}
          playerUsername={gameState.player2Username}
          symbol="O"
          isActive={gameState.currentTurnPlayerId === gameState.player2Id && !gameState.isFinished}
          isBot={isBotGame && gameState.player2Id !== user?.id}
          isYou={gameState.player2Id === user?.id}
          myName={myName}
          fallbackName={t.game.player2}
          gameState={gameState}
        />
      </div>

      {!gameState.isFinished && (
        <div className={clsx(
          "w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2",
          isMyTurn ? "bg-primary-muted border-primary/30 text-text" : "bg-surface border-border text-text-secondary",
        )}>
          <Zap className={clsx("w-4 h-4", isMyTurn ? "text-neon-cyan" : "text-text-muted")} />
          {isMyTurn ? t.game.yourTurn : t.game.waitingFor.replace("{name}", opponentName)}
        </div>
      )}

      <div className="relative">
        <div className="grid grid-cols-3 gap-3 bg-bg-card border border-border rounded-3xl p-5 relative">
          {board.map((cell, i) => {
            const isCellActive = cell !== "X" && cell !== "O" && isMyTurn && !gameState.isFinished;
            return (
              <button
                key={i}
                onClick={() => onCellClick(i)}
                disabled={!isCellActive}
                className={clsx(
                  "aspect-square flex items-center justify-center text-4xl font-bold border-2 rounded-md transition-colors duration-150",
                  cell === "X" ? "text-accent bg-accent-muted border-accent/40" :
                  cell === "O" ? "text-warning bg-warning-bg border-warning/40" :
                  "bg-surface border-border-light hover:border-primary/40 hover:bg-primary-muted cursor-pointer",
                )}
              >
                {cell === "X" && <span className="text-accent">X</span>}
                {cell === "O" && <span className="text-warning">O</span>}
              </button>
            );
          })}
        </div>

        <GameResult
          gameState={gameState}
          user={user}
          opponentDisconnected={opponentDisconnected}
          t={t}
          onPlayAgain={onPlayAgain}
          onLobby={onLobby}
        />
      </div>

      {!gameState.isFinished && (
        <div className="flex justify-center">
          <GButton onClick={onLeave} variant="dangerOutline" size="sm">Leave Game</GButton>
        </div>
      )}
    </div>
  );
}

export { GameBoard };
