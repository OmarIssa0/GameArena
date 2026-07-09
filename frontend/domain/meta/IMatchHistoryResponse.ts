import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface IMatchHistoryResponse {
  id: string;
  completedAt: string;
  isWinner: boolean;
  result: MatchStatusEnum;
  opponent: IUserSummary;
  kind: GamesKindEnum;
}

export type { IMatchHistoryResponse };
