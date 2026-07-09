import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface ISearchResult extends IUserSummary {
  isSendRequest: boolean;
}

export type { ISearchResult };
