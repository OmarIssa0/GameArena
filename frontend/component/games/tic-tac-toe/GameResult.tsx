"use client";

import { Home, Trophy, Frown, Handshake } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";
import type { TicTacToeTranslations } from "@/app/(dashboard)/tic-tac-toe/i18n/en.i18n";

interface GameResultProps {
  gameState: TNullable<ITicTacToeGameState>;
  user: TNullable<{ id: string }>;
  opponentDisconnected: boolean;
  t: TicTacToeTranslations;
  onPlayAgain: () => void;
  onLobby: () => void;
}

function GameResult({ gameState, user, opponentDisconnected, t, onPlayAgain, onLobby }: GameResultProps) {
  const isWin = gameState?.winnerPlayerId === user?.id;
  const isDraw = gameState?.isFinished && !gameState.winnerPlayerId;
  const isLoss = gameState?.isFinished && !isWin && !isDraw && !opponentDisconnected;

  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let color: string;

  if (opponentDisconnected) {
    icon = <Trophy className="w-16 h-16 text-success" />;
    title = t.game.opponentForfeited;
    description = t.game.opponentForfeitedDesc;
    color = "text-success";
  } else if (isWin) {
    icon = <Trophy className="w-16 h-16 text-warning" />;
    title = t.game.victory;
    description = t.game.victoryDesc;
    color = "text-warning";
  } else if (isDraw) {
    icon = <Handshake className="w-16 h-16 text-neon-cyan" />;
    title = t.game.draw;
    description = t.game.drawDesc;
    color = "text-neon-cyan";
  } else if (isLoss) {
    icon = <Frown className="w-16 h-16 text-error" />;
    title = t.game.defeat;
    description = t.game.defeatDesc;
    color = "text-error";
  } else {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-bg/95 rounded-3xl border border-border flex flex-col items-center justify-center p-6 text-center z-10">
      {icon}
      <h2 className={`text-2xl font-black mt-4 ${color}`}>{title}</h2>
      <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">{description}</p>
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        <GButton onClick={onPlayAgain} className="flex-1">{t.end.playAgain}</GButton>
        <GButton onClick={onLobby} variant="secondary" className="flex-1" leftIcon={<Home className="w-4 h-4" />}>
          {t.end.lobby}
        </GButton>
      </div>
    </div>
  );
}

export { GameResult };
