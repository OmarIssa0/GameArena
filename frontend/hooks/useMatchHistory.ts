"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { matchHistoryService } from "@/services/def/MatchHistoryService";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";

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

function useMatchHistory(filter: MatchStatusEnum, limit?: number) {
  const [matches, setMatches] = useState<IMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      const res = await matchHistoryService.getMatchHistory();
      if (!alive) return;
      if (res.data) {
        setMatches(res.data);
      }
      setLoading(false);
    };

    void load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = filter === MatchStatusEnum.All ? matches : matches.filter((m) => m.result === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit, matches]);

  const summary = useMemo(() => buildSummary(matches), [matches]);

  return { matches: filtered, summary, loading };
}

export { useMatchHistory };
