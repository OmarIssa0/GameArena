"use client";

import clsx from "clsx";

import { useAuth } from "@/app/providers/AuthProvider";
import type { ITicTacToeGameState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GList } from "@/component/common/GList";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

const BOARD_EMPTY = ".";
const PLAYER_X = "X";
const PLAYER_O = "O";

function TicTacToePage() {
  const { user } = useAuth();
  const { state, sendAction } = useGame();
  const t = useGameTranslation();

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>{null}</GameLayoutWrapper>;
  }

  const tttState = state as ITicTacToeGameState;
  const { board, player1Score, player2Score, winScore } = tttState;
  const myPlayerId = user?.id;
  const isMyTurn = tttState.currentTurnPlayerId === myPlayerId;
  const isOver = tttState.winnerPlayerId != null || tttState.isFinished === true;

  const isCellPlayable = (cell: string): boolean => cell !== PLAYER_X && cell !== PLAYER_O && isMyTurn && !isOver;

  const cells = board.map((cell, index) => ({ index, cell }));

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>
      <GCard padding={SizeEnum.md}>
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{player1Score}</div>
            <div className="text-xs text-text-muted">{PLAYER_X}</div>
          </div>
          <div className="text-center text-text-muted font-bold flex flex-col justify-center">
            <span>{t.game.vs}</span>
            <span className="text-xs">{t.game.firstTo.replace("{score}", String(winScore))}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{player2Score}</div>
            <div className="text-xs text-text-muted">{PLAYER_O}</div>
          </div>
        </div>
        <GList items={cells} keyExtractor={(item) => item.index.toString()} listClassName="grid grid-cols-3 gap-3 text-center">
          {({ index, cell }) => (
            <GButton
              onClick={() => sendAction({ type: GameActionTypes.MAKE_MOVE, cell: index })}
              disabled={!isCellPlayable(cell)}
              size={SizeEnum.xl}
              rounded={SizeEnum.md}
              className={clsx("aspect-square", cell === PLAYER_X && "text-accent", cell === PLAYER_O && "text-warning")}
              variant={cell === BOARD_EMPTY ? ButtonVariantEnum.Secondary : ButtonVariantEnum.Subtle}>
              {cell === PLAYER_X && <span className="text-accent">{PLAYER_X}</span>}
              {cell === PLAYER_O && <span className="text-warning">{PLAYER_O}</span>}
              {cell === BOARD_EMPTY && <span>{BOARD_EMPTY}</span>}
            </GButton>
          )}
        </GList>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default TicTacToePage;
