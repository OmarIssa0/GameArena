import { GamesList } from "@/domain/constant/games";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GAvatar } from "@/component/common/GAvatar";
import { GList } from "@/component/common/GList";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import { Gamepad2 } from "lucide-react";

interface MatchHistoryTableProps {
  matches: IMatchHistory[];
  locale: string;
  winLabel: string;
  lossLabel: string;
  drawLabel: string;
  gameLabels: Record<GamesKindEnum, string>;
}

function resultBadge(result: MatchStatusEnum, winLabel: string, lossLabel: string, drawLabel: string) {
  const isWin = result === MatchStatusEnum.Win;
  const isLoss = result === MatchStatusEnum.Lost;
  return (
    <GBadge variant={isWin ? "success" : isLoss ? "danger" : "warning"} size="sm">
      {isWin ? winLabel : isLoss ? lossLabel : drawLabel}
    </GBadge>
  );
}

export function MatchHistoryTable({ matches, locale, winLabel, lossLabel, drawLabel, gameLabels }: MatchHistoryTableProps) {
  return (
    <GList items={matches} keyExtractor={(match) => match.id}>
      {(match) => {
        const game = match.kind !== GamesKindEnum.None ? GamesList[match.kind] : undefined;
        return (
          <div className="flex items-center justify-between py-3 px-4 border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <GIcon icon={game?.icon ?? Gamepad2} size="sm" tile tileSize="sm" tileGradient={game?.gradient} />
              <span className="font-medium text-text truncate">{gameLabels[match.kind]}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <GAvatar
                firstName={match.opponent.firstName}
                lastName={match.opponent.lastName}
                status={match.opponent.status}
                size="xs"
                shape="circle"
              />
              <span className="truncate text-text-secondary">@{match.opponent.fullName ?? match.opponent.userName}</span>
            </div>
            <div className="flex-shrink-0">{resultBadge(match.result, winLabel, lossLabel, drawLabel)}</div>
            <div className="text-end text-xs text-text-muted whitespace-nowrap flex-shrink-0">
              {new Date(match.completedAt).toLocaleString(locale)}
            </div>
          </div>
        );
      }}
    </GList>
  );
}
