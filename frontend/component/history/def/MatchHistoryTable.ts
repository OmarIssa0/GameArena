import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

export interface IMatchHistoryTableProps {
  matches: IMatchHistory[];
  locale: string;
  winLabel: string;
  lossLabel: string;
  drawLabel: string;
  gameLabels: Record<GamesKindEnum, string>;
}
