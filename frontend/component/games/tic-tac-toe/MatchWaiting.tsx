"use client";

import { Play, UserPlus, User } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import type { TNullable } from "@/domain/type/TCommon";
import type { ITicTacToeGameState } from "@/domain/meta/ITicTacToeGameState";
import type { TicTacToeTranslations } from "@/app/(dashboard)/tic-tac-toe/i18n/en.i18n";

interface MatchWaitingProps {
  gameState: TNullable<ITicTacToeGameState>;
  user: TNullable<{ id: string; userName?: TNullable<string> }>;
  myName: string;
  t: TicTacToeTranslations;
  onStartVsAI: () => void;
  onInviteFriend: () => void;
  onCancel: () => void;
}

function MatchWaiting({ gameState, user, myName, t, onStartVsAI, onInviteFriend, onCancel }: MatchWaitingProps) {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="grid grid-cols-7 items-center bg-bg-card border border-border rounded-lg p-4">
        <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
          <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-primary bg-primary-muted">
            <User className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
            {gameState?.player1Id === user?.id ? `${myName} (You)` : gameState?.player1Username || t.game.player1}
          </span>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-text-muted">VS</span>
          <div className="w-px h-10 bg-border/40 mt-1" />
        </div>
        <div className="col-span-3 flex flex-col items-center text-center p-2 relative opacity-50">
          <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-dashed border-border-light bg-surface/50">
            <GSpinner size="sm" className="text-text-secondary" />
          </div>
          <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
            {t.game.waiting}
          </span>
        </div>
      </div>

      <p className="text-center text-text-secondary text-sm">{t.lobby.waitingForOpponent}</p>

      <div className="flex flex-col gap-3">
        {gameState?.player1Id === user?.id && (
          <>
            <GButton onClick={onStartVsAI} fullWidth leftIcon={<Play className="w-5 h-5" />}>
              Start Game (vs AI)
            </GButton>
            <GButton onClick={onInviteFriend} fullWidth variant="secondary" leftIcon={<UserPlus className="w-5 h-5" />}>
              Invite Friend
            </GButton>
          </>
        )}
        <GButton onClick={onCancel} variant="secondary">{t.lobby.cancelMatch}</GButton>
      </div>
    </div>
  );
}

export { MatchWaiting };
