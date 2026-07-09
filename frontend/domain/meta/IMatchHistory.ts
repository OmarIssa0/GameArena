import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface IMatchHistory {
  id: string;
  game: GamesKindEnum;
  opponentName: string;
  result: MatchResultEnum;
  playedAt: Date;
}

interface IMatchHistorySummary {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

export type { IMatchHistory, IMatchHistorySummary };
