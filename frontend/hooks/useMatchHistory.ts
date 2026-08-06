"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { matchHistoryService } from "@/services/def/MatchHistoryService";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TNullable } from "@/domain/type/TCommon";

function buildSummary(matches: IMatchHistory[]) {
  return matches.reduce(
    (acc, match) => {
      acc.total += 1;
      if (match.result === MatchStatusEnum.Win) acc.wins += 1;
      if (match.result === MatchStatusEnum.Lost) acc.losses += 1;
      if (match.result === MatchStatusEnum.Draw) acc.draws += 1;
      return acc;
    },
    { wins: 0, losses: 0, draws: 0, total: 0 },
  );
}

function useMatchHistory(statusFilter: MatchStatusEnum = MatchStatusEnum.All, limit?: number, fallbackErrorMessage = "") {
  const [allMatches, setAllMatches] = useState<IMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const fallbackErrorRef = useRef(fallbackErrorMessage);

  useEffect(() => {
    fallbackErrorRef.current = fallbackErrorMessage;
  }, [fallbackErrorMessage]);

  useEffect(() => {
    let alive = true;
    matchHistoryService
      .getMatchHistory()
      .then((res) => {
        if (!alive) return;
        if (res.data) setAllMatches(res.data);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        const message = err instanceof Error && err.message ? err.message : fallbackErrorRef.current;
        setError(message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const summary = useMemo(() => buildSummary(allMatches), [allMatches]);

  const matches = useMemo(() => {
    const list = statusFilter === MatchStatusEnum.All ? allMatches : allMatches.filter((m) => m.result === statusFilter);
    return limit ? list.slice(0, limit) : list;
  }, [statusFilter, limit, allMatches]);

  return { matches, summary, loading, error };
}

export { useMatchHistory };
