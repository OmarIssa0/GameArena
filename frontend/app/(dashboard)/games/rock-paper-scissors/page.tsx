"use client";

import { useAuth } from "@/app/providers/AuthProvider";

import type { IGameState, RPSChoice } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GList } from "@/component/common/GList";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { RPS_CHOICE_EMOJI, RPS_CHOICES } from "@/domain/constant/game-constants";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

type RPSState = IGameState & { player1Choice?: RPSChoice; player2Choice?: RPSChoice };

const CHOICE_ITEMS = RPS_CHOICES.map((choice) => ({
  id: choice,
  labelKey: choice.toLowerCase() as "rock" | "paper" | "scissors",
  emoji: RPS_CHOICE_EMOJI[choice],
}));

function RockPaperScissorsPage() {
  const { user } = useAuth();
  const { state, sendAction } = useGame();
  const t = useGameTranslation();

  if (!state || !("winScore" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.RockPaperScissors}>{null}</GameLayoutWrapper>;
  }

  const rpsState = state as RPSState;
  const myPlayerId = user?.id;
  const isPlayer1 = rpsState.player1Id === myPlayerId;
  const myChoice = isPlayer1 ? rpsState.player1Choice : rpsState.player2Choice;
  const oppChoice = isPlayer1 ? rpsState.player2Choice : rpsState.player1Choice;
  const myScore = isPlayer1 ? rpsState.player1Score : rpsState.player2Score;
  const oppScore = isPlayer1 ? rpsState.player2Score : rpsState.player1Score;
  const isMyTurn = rpsState.currentTurnPlayerId === myPlayerId;
  const isOver = rpsState.winnerPlayerId != null || rpsState.isFinished === true;

  const handleChoice = (choice: string) => {
    if (isOver || !isMyTurn || myChoice) return;
    sendAction({ type: GameActionTypes.MAKE_MOVE, choice });
  };

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.RockPaperScissors}>
      <GCard padding={SizeEnum.md}>
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{myScore}</div>
            <div className="text-xs text-text-muted">{t.game.you}</div>
          </div>
          <div className="text-center text-text-muted font-bold flex flex-col justify-center">
            <span>{t.game.vs}</span>
            <span className="text-xs">{t.game.firstTo.replace("{score}", String(rpsState.winScore))}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{oppScore}</div>
            <div className="text-xs text-text-muted">{t.game.opponent}</div>
          </div>
        </div>

        <GList items={CHOICE_ITEMS} keyExtractor={(item) => item.id} listClassName="grid grid-cols-3 gap-4 mb-6">
          {({ id, labelKey, emoji }) => (
            <GButton
              onClick={() => handleChoice(id)}
              disabled={isOver || !isMyTurn || !!myChoice}
              size={SizeEnum.lg}
              rounded={SizeEnum.xl}
              className="aspect-square min-w-16 flex flex-col items-center justify-center gap-1"
              variant={myChoice === id ? ButtonVariantEnum.Primary : isMyTurn && !isOver ? ButtonVariantEnum.Secondary : ButtonVariantEnum.Subtle}>
              <span className="text-4xl">{emoji}</span>
              <span className="text-xs text-text-muted">{t.rockpaperscissors[labelKey]}</span>
            </GButton>
          )}
        </GList>

        <div className="flex justify-center gap-12 mb-6">
          <div className="flex flex-col items-center">
            <div className="text-sm text-text-muted">{t.game.you}</div>
            <div className="text-6xl mt-2">{myChoice ? RPS_CHOICE_EMOJI[myChoice] : "❓"}</div>
          </div>
          <div className="text-center text-text-muted font-bold flex flex-col justify-center">
            <span className="text-2xl">{t.game.vs}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm text-text-muted">{t.game.opponent}</div>
            <div className="text-6xl mt-2">{oppChoice ? RPS_CHOICE_EMOJI[oppChoice] : isOver ? "❓" : "⏳"}</div>
          </div>
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default RockPaperScissorsPage;
