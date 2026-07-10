import { matchHistoryApi } from "../proxy/matchHistory.api";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";
import type { IMatchHistoryRepository } from "../meta/IMatchHistoryRepository";

class MatchHistoryRepository implements IMatchHistoryRepository {
  private static instance: MatchHistoryRepository;
  private api = matchHistoryApi.api;

  async getMatchHistory(): TPromise<IMatchHistory[]> {
    return this.api.getMatchHistory<IMatchHistory[]>();
  }

  static getInstance() {
    if (!MatchHistoryRepository.instance) {
      MatchHistoryRepository.instance = new MatchHistoryRepository();
    }
    return MatchHistoryRepository.instance;
  }
}

export const matchHistoryRepository = MatchHistoryRepository.getInstance();
