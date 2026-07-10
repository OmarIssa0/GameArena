"use client";

import { Frown, Swords, Sparkles, UserPlus } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { GInputSearch } from "@/component/common/GInputSearch";
import { GTabs } from "@/component/common/GTabs";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import type { GTabItem } from "@/component/common/def/GTabs";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

type LobbyTab = "quick" | "invite";

interface GameLobbyTranslations {
  title: string;
  subtitle: string;
  findMatch: string;
  connecting: string;
  tabs: { quick: string; invite: string };
  searchFriends: string;
  noFriendsFound: string;
  searchingTitle: string;
  searchingSubtitle: string;
  cancelSearch: string;
}

interface GameLobbyProps {
  isSearching: boolean;
  isConnected: boolean;
  findMatch: () => void;
  resetGame: () => void;
  t: GameLobbyTranslations;
}

function GameLobby({
  isSearching,
  isConnected,
  findMatch,
  resetGame,
  t,
}: GameLobbyProps) {
  if (isSearching) {
    return (
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <GSpinner size="lg" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{t.searchingTitle}</p>
          <p className="text-xs text-text-muted mt-1">{t.searchingSubtitle}</p>
        </div>
        <GButton onClick={resetGame} variant="secondary" fullWidth>
          {t.cancelSearch}
        </GButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 text-center relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl" />

      <div className="flex justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-md bg-primary/15">
          <Swords className="w-8 h-8 text-text" />
        </div>
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-2 text-text">
        {t.title}
      </h1>
      <p className="text-text-secondary text-sm mb-6">{t.subtitle}</p>

      <div className="space-y-4">
        <GButton
          onClick={findMatch}
          disabled={!isConnected}
          fullWidth
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          {t.findMatch}
        </GButton>
        {!isConnected && (
          <p className="text-xs text-error bg-error-bg py-2 rounded-lg">
            {t.connecting}
          </p>
        )}
      </div>
    </div>
  );
}

export { GameLobby, type LobbyTab, type GameLobbyTranslations };
