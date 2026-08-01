import { GamesList } from "@/domain/constant/games";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GAvatar } from "@/component/common/GAvatar";
import { GList } from "@/component/common/GList";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";
import type { IMatchHistoryTableProps } from "./def/MatchHistoryTable";

function resultBadge(result: MatchStatusEnum, winLabel: string, lossLabel: string, drawLabel: string) {
  const isWin = result === MatchStatusEnum.Win;
  const isLoss = result === MatchStatusEnum.Lost;
  return (
    <GBadge variant={isWin ? AccentColorEnum.Success : isLoss ? AccentColorEnum.Danger : AccentColorEnum.Warning} size={SizeEnum.sm}>
      {isWin ? winLabel : isLoss ? lossLabel : drawLabel}
    </GBadge>
  );
}

export function MatchHistoryTable({ matches, locale, winLabel, lossLabel, drawLabel, gameLabels }: IMatchHistoryTableProps) {
  return (
    <GList items={matches} keyExtractor={(match) => match.id}>
      {(match) => {
        const game = GamesList[match.kind];
        return (
          <div className="flex items-center justify-between py-3 px-4 border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <GIcon icon={game.icon} size={SizeEnum.sm} tile tileGradient={game.gradient} />
              <span className="font-medium text-text truncate">{gameLabels[match.kind]}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <GAvatar
                firstName={match.opponent.firstName}
                lastName={match.opponent.lastName}
                status={match.opponent.status}
                 size={SizeEnum.xs}
                 shape={AvatarShapeEnum.Circle}
              />
              <span className="truncate text-text-secondary">@{match.opponent.fullName ?? match.opponent.userName}</span>
            </div>
            <div className="shrink-0">{resultBadge(match.result, winLabel, lossLabel, drawLabel)}</div>
            <div className="text-end text-xs text-text-muted whitespace-nowrap shrink-0">
              {new Date(match.completedAt).toLocaleString(locale)}
            </div>
          </div>
        );
      }}
    </GList>
  );
}
