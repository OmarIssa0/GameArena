"use client";

import { GameProvider } from "@/app/providers/GameProvider";

function GameLayout({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

export default GameLayout;
