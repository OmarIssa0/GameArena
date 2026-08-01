"use client";

import { Zap } from "lucide-react";
import clsx from "clsx";
import { GIcon } from "@/component/common/GIcon";
import type { IGameTurnIndicatorProps } from "./def/GameTurnIndicator";
import { SizeEnum } from "@/domain/enum/SizeEnum";

function GameTurnIndicator({ isMyTurn, currentTurnText, waitingText }: IGameTurnIndicatorProps) {
  return (
    <div
      className={clsx(
        "w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2",
        isMyTurn ? "bg-primary-muted border-primary/30 text-text" : "bg-surface border-border text-text-secondary",
      )}>
      <GIcon icon={Zap} size={SizeEnum.sm} className={isMyTurn ? "text-neon-cyan" : "text-text-muted"} />
      {isMyTurn ? currentTurnText : waitingText}
    </div>
  );
}

export { GameTurnIndicator };
