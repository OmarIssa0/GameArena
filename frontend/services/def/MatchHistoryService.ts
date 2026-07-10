import { matchHistoryRepository } from "@/repositories/def/MatchHistoryRepository";
import type { IMatchHistoryService } from "../meta/IMatchHistoryService";
import type { IMatchHistoryRepository } from "@/repositories/meta/IMatchHistoryRepository";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

class MatchHistoryService implements IMatchHistoryService {
  constructor(private repository: IMatchHistoryRepository) {}
  async getMatchHistory(): TPromise<IMatchHistory[]> {
    return this.repository.getMatchHistory();
  }
}

const matchHistoryService = new MatchHistoryService(matchHistoryRepository);

export { matchHistoryService };
