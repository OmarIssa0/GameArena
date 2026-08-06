import type { ReactNode } from "react";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

export interface IGameActiveProps {
  children: ReactNode;
  gameType: GamesKindEnum;
}
