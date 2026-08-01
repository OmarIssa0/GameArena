"use client";

import { Home, Trophy, Frown, Handshake, Loader2 } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import type { TNullable, TOptional } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

const RESULT_ICONS = { win: Trophy, draw: Handshake, loss: Frown, forfeit: Trophy } as const;

const RESULT_META = {
  win: { tile: "bg-warning", tileColor: AccentColorEnum.OnPrimary, textColor: "text-warning" },
  draw: { tile: "bg-primary", tileColor: AccentColorEnum.OnPrimary, textColor: "text-neon-cyan" },
  loss: { tile: "bg-error", tileColor: AccentColorEnum.OnPrimary, textColor: "text-error" },
  forfeit: { tile: "bg-success", tileColor: AccentColorEnum.OnPrimary, textColor: "text-success" },
} as const;

type ResultKind = keyof typeof RESULT_ICONS;

function getResultKind(winnerPlayerId: TOptional<string>, userId: TOptional<string>, opponentDisconnected: boolean): TNullable<ResultKind> {
  if (winnerPlayerId === "") return "draw";
  if (winnerPlayerId === userId) return "win";
  if (winnerPlayerId != null) return "loss";
  if (opponentDisconnected) return "forfeit";
  return null;
}

function PendingPlayAgainOverlay() {
  const { pendingPlayAgainRequest, respondPlayAgain } = useGame();
  const t = useGameTranslation();

  if (!pendingPlayAgainRequest) return null;

  return (
    <GCard padding={SizeEnum.lg} className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center text-center z-20">
      <h2 className="text-xl font-black text-text">{t.result.playAgainRequest}</h2>
      <p className="text-text-secondary text-sm mt-2">{pendingPlayAgainRequest.requesterUsername}</p>
      <div className="flex gap-4 mt-8 w-full max-w-xs">
        <GButton onClick={() => respondPlayAgain(true)} className="flex-1">
          {t.result.accept}
        </GButton>
        <GButton onClick={() => respondPlayAgain(false)} variant={AccentColorEnum.Danger} className="flex-1">
          {t.result.reject}
        </GButton>
      </div>
    </GCard>
  );
}

function GameOverActions({ kind, opponentDisconnected }: { kind: ResultKind; opponentDisconnected: boolean }) {
  const { requestedPlayAgain, requestPlayAgain, leaveGame } = useGame();
  const t = useGameTranslation();

  const gameHasResult = kind !== "forfeit";
  const sessionEnded = opponentDisconnected && gameHasResult;

  return (
    <div className="flex gap-4 mt-8 w-full max-w-xs">
      {sessionEnded ? (
        <GButton onClick={() => leaveGame()} variant={AccentColorEnum.Secondary} className="flex-1" startIcon={<GIcon icon={Home} size={SizeEnum.sm} />}>
          {t.result.backToLobby}
        </GButton>
      ) : requestedPlayAgain ? (
        <GButton disabled className="flex-1">
          <Loader2 className="animate-spin me-2 h-4 w-4 inline" />
          {t.result.waiting}
        </GButton>
      ) : (
        <GButton onClick={() => requestPlayAgain()} className="flex-1">
          {t.result.playAgain}
        </GButton>
      )}
      {!sessionEnded && (
        <GButton onClick={() => leaveGame()} variant={AccentColorEnum.Secondary} className="flex-1" startIcon={<GIcon icon={Home} size={SizeEnum.sm} />}>
          {t.result.backToLobby}
        </GButton>
      )}
    </div>
  );
}

function GameResult() {
  const { user } = useAuth();
  const { state, opponentDisconnected, pendingPlayAgainRequest } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const kind = getResultKind(state.winnerPlayerId, user?.id, opponentDisconnected);

  if (pendingPlayAgainRequest || kind === null) {
    if (pendingPlayAgainRequest) return <PendingPlayAgainOverlay />;
    return null;
  }

  const Icon = RESULT_ICONS[kind];
  const meta = RESULT_META[kind];
  const RESULT_TITLES = { win: t.result.victory, draw: t.result.draw, loss: t.result.defeat, forfeit: t.result.opponentForfeited };
  const RESULT_DESCS = { win: t.result.victoryDesc, draw: t.result.drawDesc, loss: t.result.defeatDesc, forfeit: t.result.opponentForfeitedDesc };

  return (
    <GCard padding={SizeEnum.lg} className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center text-center z-10">
      <GIcon icon={Icon} size={SizeEnum.lg} tile tileGradient={meta.tile} tileColor={meta.tileColor} />
      <h2 className={`text-2xl font-black mt-4 ${meta.textColor}`}>{RESULT_TITLES[kind]}</h2>
      <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">{RESULT_DESCS[kind]}</p>
      {state.score && (
        <p className="text-text-secondary text-xs mt-1">
          Score: {state.score[0]} - {state.score[1]}
        </p>
      )}
      <GameOverActions kind={kind} opponentDisconnected={opponentDisconnected} />
    </GCard>
  );
}

export { GameResult };
