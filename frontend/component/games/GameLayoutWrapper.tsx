"use client";

import { useGame } from "@/app/providers/GameProvider";
import type { IGameState } from "@/app/providers/def/IGameState";
import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable } from "@/domain/type/TCommon";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GameActive } from "./GameActive";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import type { GameLayoutWrapperProps } from "./def/GameLayoutWrapper";

type GameStageKind = "loading" | "entry" | "lobby" | "ready" | "active";

function resolveStage(state: TNullable<IGameState>, connected: boolean, searching: boolean): GameStageKind {
  if (!state) return connected && !searching ? "entry" : "loading";
  if (!state.player2Id) return "lobby";
  if (!state.hasStarted) return "ready";
  return "active";
}

function GameLayoutWrapper({ children, gameType }: GameLayoutWrapperProps) {
  const { state, isConnected, isSearching } = useGame();
  const t = useGameTranslation();

  const stage = resolveStage(state, isConnected, isSearching);

  if (stage === "loading") {
    return (
      <div
        className={
          isSearching
            ? "flex flex-col items-center justify-center min-h-40 p-4 gap-4 text-center"
            : "flex items-center justify-center min-h-40 p-4"
        }>
        <GSpinner size={SizeEnum.lg} />
        {isSearching && <p className="text-text-secondary text-sm">{t.lobby.searchingTitle}</p>}
      </div>
    );
  }
  if (stage === "entry") return <GameEntry gameType={gameType} />;
  if (stage === "lobby") return <GameLobby gameType={gameType} />;
  if (stage === "ready") return <GameReady gameType={gameType} />;
  return <GameActive gameType={gameType}>{children}</GameActive>;
}

export { GameLayoutWrapper };
