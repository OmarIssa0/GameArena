import type { ReactNode } from "react";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IGameLayoutWrapperProps {
  children: ReactNode;
  gameType: GamesKindEnum;
}

export type { IGameLayoutWrapperProps };
