"use client";

import { ArrowRight, Frown, Handshake, History, Trophy } from "lucide-react";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { GSpinner } from "@/component/common/GSpinner";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import Link from "next/link";
import { ar } from "@/app/(dashboard)/history/i18n/ar.i18n";
import { en, type THistoryTranslation } from "@/app/(dashboard)/history/i18n/en.i18n";
import type { TLocale } from "@/domain/type/TCommon";
import type { RecentHistorySectionProps } from "./def/RecentHistorySection";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { MatchHistoryItem } from "./MatchHistoryItem";

function RecentHistorySection({ title, viewAll, emptyTitle, emptyDescription, limit = 3 }: RecentHistorySectionProps) {
  const [locale] = useLocale() as [TLocale, (l: TLocale) => void];
  const historyT = useTranslation({ en, ar }) as THistoryTranslation;
  const { matches, summary, loading } = useMatchHistory(MatchStatusEnum.All, limit);
  const items = [
    { label: historyT.summary.wins, value: summary.wins, icon: Trophy, iconColor: "success" as const },
    { label: historyT.summary.losses, value: summary.losses, icon: Frown, iconColor: "danger" as const },
    { label: historyT.summary.draws, value: summary.draws, icon: Handshake, iconColor: "primary" as const },
  ];
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest">{title}</h2>
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
          {viewAll}
          <GIcon icon={ArrowRight} size="xs" color="primary" className="rtl:-scale-x-100" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <GSpinner />
        </div>
      ) : matches.length === 0 ? (
        <GEmpty icon={<GIcon icon={History} size="xl" color="muted" className="opacity-50" />} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="flex flex-col gap-4">
          <GList items={items} keyExtractor={(item) => item.label} listClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" noPagination>
            {(item) => (
              <div className="flex items-center gap-3 p-3.5 bg-bg-card border border-border rounded-lg hover:border-border-light hover:bg-bg-card-hover transition-all duration-200">
                <GIcon icon={item.icon} size="md" tile tileSize="md" tileGradient={`bg-${item.iconColor}`} tileColor="text" />
                <div>
                  <p className="text-xl font-extrabold leading-tight text-text">{item.value}</p>
                  <p className="text-xs font-medium text-text-secondary mt-0.5">{item.label}</p>
                </div>
              </div>
            )}
          </GList>
          <div className="flex flex-col gap-3">
            <GList items={matches} keyExtractor={(match) => match.id} noPagination>
              {(match) => (
                <MatchHistoryItem
                  match={match}
                  winLabel={historyT.results.win}
                  lossLabel={historyT.results.loss}
                  drawLabel={historyT.results.draw}
                  gameLabel={historyT.games[match.kind as keyof typeof historyT.games]}
                  locale={locale}
                  versusLabel={historyT.versus}
                />
              )}
            </GList>
          </div>
        </div>
      )}
    </section>
  );
}

export { RecentHistorySection };
