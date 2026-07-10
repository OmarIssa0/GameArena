"use client";

import { Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";

import { GIconTile } from "@/component/common/GIconTile";
import { GIcon } from "@/component/common/GIcon";
import { GameCard } from "@/component/games/common/GameCard";
import { GamesList } from "@/domain/constant/games";

function GamesPage() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TGamesTranslation;

  const handleGameSelect = (path: string) => router.push(`/games/${path}`);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="mb-8">
        <div className="mb-6 flex justify-center">
          <GIconTile gradient="game-cyan" size="lg">
            <GIcon icon={Gamepad2} size="lg" color="inherit" className="text-text" />
          </GIconTile>
        </div>

        <h1 className="mb-2 text-4xl font-black tracking-tight text-text">{t.title}</h1>

        <p className="text-sm text-text-secondary">{t.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {GamesList.map((game) => (
          <GameCard
            key={game.type}
            name={t[game.name]}
            desc={t[game.description]}
            gradient={game.gradient}
            playLabel={t.play}
            onClick={() => handleGameSelect(game.path)}
          />
        ))}
      </div>
    </div>
  );
}
export default GamesPage;
