"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { GList } from "@/component/common/GList";
import { AlertTriangle } from "lucide-react";
import { GTabs } from "@/component/common/GTabs";
import { GSpinner } from "@/component/common/GSpinner";
import { GEmpty } from "@/component/common/GEmpty";
import { GCard } from "@/component/common/GCard";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GPage } from "@/component/common/GPage";
import { PageHeader } from "@/component/common/PageHeader";
import { MatchHistoryItem } from "@/component/history/MatchHistoryItem";
import { MatchHistoryTable } from "@/component/history/MatchHistoryTable";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { ar } from "./i18n/ar.i18n";
import { en, type THistoryTranslation } from "./i18n/en.i18n";
import type { GTabItem } from "@/component/common/def/GTabs";

export default function MatchHistoryPage() {
  const [locale] = useLocale();
  const t = useTranslation({ en, ar }) as THistoryTranslation;
  const [filter, setFilter] = useState(MatchStatusEnum.All);
  const { matches, loading, error } = useMatchHistory(filter);
  const tabs = useMemo<GTabItem<MatchStatusEnum>[]>(
    () => [
      { id: MatchStatusEnum.All, label: t.filters.all },
      { id: MatchStatusEnum.Win, label: t.filters.win },
      { id: MatchStatusEnum.Lost, label: t.filters.loss },
      { id: MatchStatusEnum.Draw, label: t.filters.draw },
    ],
    [t],
  );

  return (
    <GPage width="lg">
      <PageHeader
        icon={History}
        title={t.title}
        subtitle={t.subtitle}
        badge={
          <GBadge>
            <GIcon icon={History} size="xs" color="primary" />
            {t.badge}
          </GBadge>
        }
      />
      <GCard padding="sm">
        <GTabs tabs={tabs} value={filter} onChange={setFilter} variant="pills" fullWidth className="mb-4" />

        {loading && (
          <div className="flex justify-center py-16">
            <GSpinner size="lg" />
          </div>
        )}

        {!loading && error && (
          <GEmpty icon={<GIcon icon={AlertTriangle} size="xl" color="danger" />} title="Unable to load history" description={error} />
        )}

        {!loading && !error && matches.length === 0 && (
          <GEmpty
            icon={<GIcon icon={History} size="xl" color="muted" />}
            title={t.empty.title}
            description={filter === MatchStatusEnum.All ? t.empty.description : t.empty.filtered}
          />
        )}

        {!loading && !error && matches.length > 0 && (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <MatchHistoryTable
                matches={matches}
                locale={locale}
                winLabel={t.results.win}
                lossLabel={t.results.loss}
                drawLabel={t.results.draw}
                gameLabels={t.games}
              />
            </div>
            <div className="sm:hidden">
              <GList items={matches} keyExtractor={(match) => match.id} >
                {(match) => (
                  <MatchHistoryItem
                    match={match}
                    locale={locale}
                    winLabel={t.results.win}
                    lossLabel={t.results.loss}
                    drawLabel={t.results.draw}
                    versusLabel={t.versus}
                    gameLabel={t.games[match.kind]}
                  />
                )}
              </GList>
            </div>
          </>
        )}
      </GCard>
    </GPage>
  );
}
