"use client";

import { ArrowRight, Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GamesList } from "@/domain/constant/games";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "../common/GCard";
import { en, type TGamesTranslation } from "@/app/(dashboard)/games/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/games/i18n/ar.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

function ActiveGameBanner() {
  const { state, lastGameType } = useGame();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TGamesTranslation & { returnToGame: string; gameRunning: string };
  const isActive = state?.hasStarted === true && state?.isFinished === false;
  const isOnGamePage = pathname.startsWith("/games/") && pathname !== "/games";

  if (!isActive || isOnGamePage) return null;

  const gamePath = lastGameType !== null ? (GamesList.find((g) => g.type === (lastGameType as typeof g.type))?.path ?? "tic-tac-toe") : "tic-tac-toe";
  const game = GamesList.find((g) => g.type === (lastGameType as typeof g.type)) ?? GamesList[0];

  return (
    <div className="fixed bottom-6 inset-inline-4 sm:inset-inline-end-4 sm:w-96 sm:max-w-none z-50 ga-slide-in-right">
      <GCard variant={CardVariantEnum.Glass} padding={SizeEnum.md} className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <GIcon icon={game.icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-muted uppercase tracking-wider">{t.gameRunning}</div>
          <div className="text-lg font-bold text-text truncate">{t[game?.name as keyof typeof t]}</div>
        </div>
        <GButton variant={AccentColorEnum.Primary} size={SizeEnum.sm} className="whitespace-nowrap" onClick={() => router.push(`/games/${gamePath}`)}>
          <GIcon icon={Gamepad2} size={SizeEnum.sm} className="animate-pulse" />
          <span>{t.returnToGame}</span>
          <GIcon icon={ArrowRight} size={SizeEnum.sm} className="rtl:-scale-x-100" />
        </GButton>
      </GCard>
    </div>
  );
}

export { ActiveGameBanner };
