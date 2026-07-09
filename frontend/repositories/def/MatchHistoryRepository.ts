import { matchHistoryApi } from "../proxy/matchHistory.api";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TPromise } from "@/domain/type/TCommon";
import type { IMatchHistoryRepository } from "../meta/IMatchHistoryRepository";

interface MatchHistoryRaw {
  id: string;
  completedAt: string;
  isWinner: boolean;
  result: MatchStatusEnum;
  opponent: IUserSummary;
  kind: number;
}

const STATUS_TO_RESULT: Record<MatchStatusEnum, MatchResultEnum> = {
  [MatchStatusEnum.Draw]: MatchResultEnum.Draw,
  [MatchStatusEnum.Lost]: MatchResultEnum.Loss,
  [MatchStatusEnum.Win]: MatchResultEnum.Win,
  [MatchStatusEnum.All]: MatchResultEnum.Win,
};

function toMatchHistory(raw: MatchHistoryRaw): IMatchHistory {
  return {
    id: raw.id,
    game: raw.kind,
    opponentName: raw.opponent.userName ?? "",
    result: STATUS_TO_RESULT[raw.result] ?? MatchResultEnum.Win,
    playedAt: new Date(raw.completedAt),
  };
}

class MatchHistoryRepository implements IMatchHistoryRepository {
  private static instance: MatchHistoryRepository;
  private api = matchHistoryApi.api;

  async getMatchHistory(): TPromise<IMatchHistory[]> {
    const res = await this.api.getMatchHistory<MatchHistoryRaw[]>();
    return {
      ...res,
      data: res.data ? res.data.map(toMatchHistory) : null,
    };
  }

  static getInstance() {
    if (!MatchHistoryRepository.instance) {
      MatchHistoryRepository.instance = new MatchHistoryRepository();
    }
    return MatchHistoryRepository.instance;
  }
}

export const matchHistoryRepository = MatchHistoryRepository.getInstance();
