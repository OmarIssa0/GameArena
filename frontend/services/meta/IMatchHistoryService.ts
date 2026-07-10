import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

interface IMatchHistoryService {
  getMatchHistory(): TPromise<IMatchHistory[]>;
}
export type { IMatchHistoryService };
