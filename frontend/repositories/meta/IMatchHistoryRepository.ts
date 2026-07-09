import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

interface IMatchHistoryRepository {
  getMatchHistory(): TPromise<IMatchHistory[]>;
}

export type { IMatchHistoryRepository };
