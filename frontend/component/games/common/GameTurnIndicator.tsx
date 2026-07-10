"use client";

import { Zap } from "lucide-react";
import clsx from "clsx";

interface GameTurnIndicatorProps {
  isMyTurn: boolean;
  currentTurnText: string;
  waitingText: string;
}

function GameTurnIndicator({
  isMyTurn,
  currentTurnText,
  waitingText,
}: GameTurnIndicatorProps) {
  return (
    <div
      className={clsx(
        "w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2",
        isMyTurn
          ? "bg-primary-muted border-primary/30 text-text"
          : "bg-surface border-border text-text-secondary",
      )}
    >
      <Zap
        className={clsx(
          "w-4 h-4",
          isMyTurn ? "text-neon-cyan" : "text-text-muted",
        )}
      />
      {isMyTurn ? currentTurnText : waitingText}
    </div>
  );
}

export { GameTurnIndicator };
