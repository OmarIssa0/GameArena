"use client";

import { Play } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";
import type { TicTacToeTranslations } from "@/app/(dashboard)/tic-tac-toe/i18n/en.i18n";

interface GameFoundProps {
  gameState: ITicTacToeGameState;
  user: TNullable<{ id: string }>;
  t: TicTacToeTranslations;
  onStart: (opponentId: string) => void;
}

function GameFound({ gameState, user, t, onStart }: GameFoundProps) {
  const isHost = user?.id === gameState.player1Id;

  return (
    <div className="w-full max-w-lg bg-bg-card border border-border rounded-lg p-8 text-center relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-primary" />
      <h2 className="text-2xl font-black text-text mb-6">{t.lobby.opponentFound}</h2>

      <div className="flex items-center justify-center gap-6 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-md flex items-center justify-center border-2 border-accent bg-accent-muted">
            <span className="text-3xl font-bold text-accent">X</span>
          </div>
          <span className="text-sm font-bold mt-3 text-text truncate max-w-[7rem]">
            {gameState.player1Id === user?.id ? t.game.you : gameState.player1Username}
          </span>
        </div>

        <div className="text-text-muted font-black italic text-xl">VS</div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-md flex items-center justify-center border-2 border-warning bg-warning-bg">
            <span className="text-3xl font-bold text-warning">O</span>
          </div>
          <span className="text-sm font-bold mt-3 text-text truncate max-w-[7rem]">
            {gameState.player2Id === user?.id ? t.game.you : gameState.player2Username}
          </span>
        </div>
      </div>

      <GButton
        disabled={!isHost}
        onClick={() => onStart(gameState.player2Id!)}
        fullWidth
        size="lg"
        leftIcon={<Play className="w-6 h-6 fill-current" />}
      >
        {isHost ? t.lobby.startGame : t.lobby.waitingForStart}
      </GButton>
    </div>
  );
}

export { GameFound };
