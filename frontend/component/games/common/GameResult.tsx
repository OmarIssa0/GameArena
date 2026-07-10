"use client";

import { Home, Trophy, Frown, Handshake } from "lucide-react";
import { GButton } from "@/component/common/GButton";

interface GameResultTranslations {
  opponentForfeited: string;
  opponentForfeitedDesc: string;
  victory: string;
  victoryDesc: string;
  draw: string;
  drawDesc: string;
  defeat: string;
  defeatDesc: string;
}

interface GameResultEndTranslations {
  playAgain: string;
  lobby: string;
}

interface GameResultProps {
  winnerPlayerId?: string;
  isFinished: boolean;
  userId?: string;
  opponentDisconnected: boolean;
  t: GameResultTranslations;
  endT: GameResultEndTranslations;
  onPlayAgain: () => void;
  onLobby: () => void;
}

function GameResult({
  winnerPlayerId,
  isFinished,
  userId,
  opponentDisconnected,
  t,
  endT,
  onPlayAgain,
  onLobby,
}: GameResultProps) {
  const isWin = winnerPlayerId === userId;
  const isDraw = isFinished && !winnerPlayerId;
  const isLoss = isFinished && !isWin && !isDraw && !opponentDisconnected;

  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let color: string;

  if (opponentDisconnected) {
    icon = <Trophy className="w-16 h-16 text-success" />;
    title = t.opponentForfeited;
    description = t.opponentForfeitedDesc;
    color = "text-success";
  } else if (isWin) {
    icon = <Trophy className="w-16 h-16 text-warning" />;
    title = t.victory;
    description = t.victoryDesc;
    color = "text-warning";
  } else if (isDraw) {
    icon = <Handshake className="w-16 h-16 text-neon-cyan" />;
    title = t.draw;
    description = t.drawDesc;
    color = "text-neon-cyan";
  } else if (isLoss) {
    icon = <Frown className="w-16 h-16 text-error" />;
    title = t.defeat;
    description = t.defeatDesc;
    color = "text-error";
  } else {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-bg/95 rounded-3xl border border-border flex flex-col items-center justify-center p-6 text-center z-10">
      {icon}
      <h2 className={`text-2xl font-black mt-4 ${color}`}>{title}</h2>
      <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">
        {description}
      </p>
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        <GButton onClick={onPlayAgain} className="flex-1">
          {endT.playAgain}
        </GButton>
        <GButton
          onClick={onLobby}
          variant="secondary"
          className="flex-1"
          leftIcon={<Home className="w-4 h-4" />}
        >
          {endT.lobby}
        </GButton>
      </div>
    </div>
  );
}

export { GameResult, type GameResultTranslations, type GameResultEndTranslations };
