"use client";

import clsx from "clsx";

import { useAuth } from "@/app/providers/AuthProvider";
import type { IConnectFourGameState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GList } from "@/component/common/GList";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CellEnum } from "@/domain/enum/CellEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

function ConnectFourPage() {
  const { user } = useAuth();
  const { state, sendAction } = useGame();
  const t = useGameTranslation();

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>{null}</GameLayoutWrapper>;
  }

  const cfState = state as IConnectFourGameState;
  const { board, player1Score, player2Score, winScore, currentTurnPlayerId, winnerPlayerId, boardWidth, boardHeight } = cfState;
  const myPlayerId = user?.id;
  const isMyTurn = currentTurnPlayerId === myPlayerId;
  const isOver = winnerPlayerId != null || cfState.isFinished === true;
  const cols = boardWidth;
  const rows = boardHeight;

  const cells: Array<{ row: number; col: number; value: number }> = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ row, col, value: board[col]?.[row] ?? CellEnum.None });
    }
  }

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>
      <GCard padding={SizeEnum.md}>
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{player1Score}</div>
            <div className="text-xs text-text-muted">{t.game.player1}</div>
          </div>
          <div className="text-center text-text-muted font-bold flex flex-col justify-center">
            <span>{t.game.vs}</span>
            <span className="text-xs">{t.game.firstTo.replace("{score}", String(winScore))}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{player2Score}</div>
            <div className="text-xs text-text-muted">{t.game.player2}</div>
          </div>
        </div>

        <GList items={[1, 2, 3, 4, 5, 6, 7]} keyExtractor={(item) => `${item}`} listClassName="grid grid-cols-7 gap-1 text-center p-4">
          {(item) => {
            const isColFull = board[item - 1][0] !== CellEnum.None;
            return (
              <GButton
                onClick={() => sendAction({ type: GameActionTypes.PLACE, col: item - 1 })}
                disabled={!isMyTurn || isOver || isColFull}
                size={SizeEnum.sm}
                rounded={SizeEnum.full}
                variant={ButtonVariantEnum.Secondary}>
                <span>{item}</span>
              </GButton>
            );
          }}
        </GList>

        <GList
          items={cells}
          keyExtractor={(item) => `${item.row}-${item.col}`}
          listClassName="grid grid-cols-7 gap-2"
          className="bg-surface rounded-xl p-3">
          {({ value }) => (
            <div
              className={clsx(
                "aspect-square rounded-full border-2 border-border/50",
                value === CellEnum.None && "bg-bg-elevated",
                value === CellEnum.PlayerOne && "bg-accent border-accent",
                value === CellEnum.PlayerTwo && "bg-warning border-warning",
              )}
            />
          )}
        </GList>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default ConnectFourPage;
