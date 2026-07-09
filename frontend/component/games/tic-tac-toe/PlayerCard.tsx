"use client";

import { Bot, User } from "lucide-react";
import clsx from "clsx";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";

interface PlayerCardProps {
  playerId: string | undefined;
  playerUsername: string | undefined;
  symbol: "X" | "O";
  isActive: boolean;
  isBot: boolean;
  isYou: boolean;
  myName: string;
  fallbackName: string;
  gameState: TNullable<ITicTacToeGameState>;
}

const symbolColors = {
  X: { box: "border-accent bg-accent-muted", badge: "bg-accent", symbol: "text-accent", turn: "text-accent" },
  O: { box: "border-warning bg-warning-bg", badge: "bg-warning", symbol: "text-warning", turn: "text-warning" },
};

function PlayerCard({ playerId, playerUsername, symbol, isActive, isBot, isYou, myName, fallbackName, gameState }: PlayerCardProps) {
  const color = symbolColors[symbol];
  const name = isYou ? `${myName} (You)` : isBot ? "AI Bot" : (playerUsername || fallbackName);
  const isTurn = gameState?.currentTurnPlayerId === playerId && !gameState?.isFinished;

  return (
    <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
      <div className={clsx(
        "relative w-16 h-16 rounded-xl flex items-center justify-center border-2",
        isTurn ? color.box : "border-border-light bg-surface",
      )}>
        {isBot ? (
          <Bot className={clsx("w-8 h-8", symbol === "X" ? "text-neon-blue" : "text-neon-magenta")} />
        ) : (
          <User className="w-8 h-8 text-text-secondary" />
        )}
        <span className={clsx("absolute -top-2 -end-2 w-6 h-6 rounded-full text-on-primary text-xs font-bold flex items-center justify-center", color.badge)}>
          {symbol}
        </span>
      </div>
      <span className="text-sm font-semibold text-text mt-3 truncate max-w-[7rem]">
        {name}
      </span>
      {isTurn && (
        <span className={clsx("text-xs font-medium mt-1", color.turn)}>Turn</span>
      )}
    </div>
  );
}

export { PlayerCard };
