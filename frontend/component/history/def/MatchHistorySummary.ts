import type { IMatchHistorySummary } from "@/domain/meta/IMatchHistory";

interface MatchHistorySummaryProps {
  summary: IMatchHistorySummary;
  labels: {
    wins: string;
    losses: string;
    draws: string;
  };
}

export type { MatchHistorySummaryProps };
