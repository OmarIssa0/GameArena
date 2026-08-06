"use client";

import { Lock, Users } from "lucide-react";

import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GAMES_BY_TYPE, translateGameInfo } from "@/domain/constant/games";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { IGameEntryProps } from "./def/GameEntry";

function GameEntry({ gameType }: IGameEntryProps) {
  const { findMatch, createLobby, searchError } = useGame();
  const t = useGameTranslation();
  const { name: gameName, description: gameDescription } = translateGameInfo(t, gameType);
  const gameConfig = GAMES_BY_TYPE[gameType];

  return (
    <div className="flex items-center justify-center min-h-37.5 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <GIcon
            icon={gameConfig.icon}
            size={SizeEnum.xl}
            tile
            tileGradient={gameConfig.gradientClass}
            tileColor={AccentColorEnum.OnPrimary}
            className="mx-auto"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-text">{gameName}</h1>
            <p className="text-text-secondary text-sm">{gameDescription}</p>
          </div>
        </div>

        {searchError && (
          <div role="alert" className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {searchError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <GButton onClick={() => findMatch(gameType)} fullWidth size={SizeEnum.lg} startIcon={<GIcon icon={Users} size={SizeEnum.md} />}>
            {t.lobby.quick}
          </GButton>
          <GButton
            onClick={() => createLobby(gameType)}
            fullWidth
            size={SizeEnum.lg}
            variant={AccentColorEnum.Secondary}
            startIcon={<GIcon icon={Lock} size={SizeEnum.md} />}>
            {t.lobby.invite}
          </GButton>
        </div>
      </div>
    </div>
  );
}

export { GameEntry };
