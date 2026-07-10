import { MatchStatusEnum } from "../enum/MatchStatusEnum";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IUserSummary } from "./IUserSummary";

interface IMatchHistory {
  id: string;
  opponentName: string;
  result: MatchStatusEnum;
  completedAt: Date;
  isWinner: boolean;
  opponent: IUserSummary;
  kind: GamesKindEnum;
}

export type { IMatchHistory };
