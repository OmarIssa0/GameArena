"use client";

import { useGame } from "@/app/providers/GameProvider";
import type { IGameState } from "@/app/providers/def/IGameState";
import { GAsync } from "@/component/common/GAsync";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable } from "@/domain/type/TCommon";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GameActive } from "./GameActive";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import type { IGameLayoutWrapperProps } from "./def/GameLayoutWrapper";

type GameStageKind = "loading" | "entry" | "lobby" | "ready" | "active";

function resolveStage(state: TNullable<IGameState>, connected: boolean, searching: boolean): GameStageKind {
  if (!state) return connected && !searching ? "entry" : "loading";
  if (!state.player2Id) return "lobby";
  if (!state.hasStarted) return "ready";
  return "active";
}

function GameLayoutWrapper({ children, gameType }: IGameLayoutWrapperProps) {
  const { state, isConnected, isSearching } = useGame();
  const t = useGameTranslation();

  const stage = resolveStage(state, isConnected, isSearching);

  if (stage === "loading") {
    return <GAsync loading spinnerSize={SizeEnum.lg} spinnerLabel={isSearching ? t.lobby.searchingTitle : undefined} className="min-h-40 p-4" />;
  }
  if (stage === "entry") return <GameEntry gameType={gameType} />;
  if (stage === "lobby") return <GameLobby gameType={gameType} />;
  if (stage === "ready") return <GameReady gameType={gameType} />;
  return <GameActive gameType={gameType}>{children}</GameActive>;
}

export { GameLayoutWrapper };
