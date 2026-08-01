import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IGameLayoutWrapperProps {
  children?: React.ReactNode;
  gameType: GamesKindEnum;
}

export type { IGameLayoutWrapperProps };
