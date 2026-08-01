import { matchHistoryRepository } from "@/repositories/def/MatchHistoryRepository";
import { withFullName } from "@/domain/lib/userUtils";
import type { IMatchHistoryService } from "../meta/IMatchHistoryService";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

class MatchHistoryService implements IMatchHistoryService {
  private repository = matchHistoryRepository;
  async getMatchHistory(): TPromise<IMatchHistory[]> {
    const result = await this.repository.getMatchHistory();
    if (result.data) {
      result.data.forEach((match) => {
        match.completedAt = new Date(match.completedAt);
        match.opponent = withFullName(match.opponent);
      });
    }
    return result;
  }
}

export const matchHistoryService = new MatchHistoryService();
