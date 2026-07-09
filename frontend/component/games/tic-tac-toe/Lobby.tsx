"use client";

import { Frown, Swords, Sparkles } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { GInputSearch } from "@/component/common/GInputSearch";
import { GTabs } from "@/component/common/GTabs";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import type { GTabItem } from "@/component/common/def/GTabs";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TicTacToeTranslations } from "@/app/(dashboard)/tic-tac-toe/i18n/en.i18n";

export type LobbyTab = "quick" | "invite";

interface LobbyProps {
  isSearching: boolean;
  isConnected: boolean;
  lobbyTab: LobbyTab;
  setLobbyTab: (tab: LobbyTab) => void;
  lobbyTabs: GTabItem<LobbyTab>[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredFriends: IUserSummary[];
  loadingFriends: boolean;
  findMatch: () => void;
  handleInvite: (id: string) => void;
  resetGame: () => void;
  t: TicTacToeTranslations;
}

function Lobby({ isSearching, isConnected, lobbyTab, setLobbyTab, lobbyTabs, searchQuery, setSearchQuery, filteredFriends, loadingFriends, findMatch, handleInvite, resetGame, t }: LobbyProps) {
  if (isSearching) {
    return (
      <div className="w-full max-w-md bg-bg-card border border-border rounded-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <GSpinner size="lg" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{t.lobby.searchingTitle}</p>
          <p className="text-xs text-text-muted mt-1">{t.lobby.searchingSubtitle}</p>
        </div>
        <GButton onClick={resetGame} variant="secondary" fullWidth>
          {t.lobby.cancelSearch}
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
      <h1 className="text-3xl font-black tracking-tight mb-2 text-text">{t.lobby.title}</h1>
      <p className="text-text-secondary text-sm mb-6">{t.lobby.subtitle}</p>

      <GTabs tabs={lobbyTabs} value={lobbyTab} onChange={setLobbyTab} variant="pills" fullWidth className="mb-6" />

      {lobbyTab === "quick" ? (
        <div className="space-y-4">
          <GButton onClick={findMatch} disabled={!isConnected} fullWidth leftIcon={<Sparkles className="w-5 h-5" />}>
            {t.lobby.findMatch}
          </GButton>
          {!isConnected && (
            <p className="text-xs text-error bg-error-bg py-2 rounded-lg">{t.lobby.connecting}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col text-start">
          <div className="mb-4">
            <GInputSearch value={searchQuery} onChange={setSearchQuery} placeholder={t.lobby.searchFriends} />
          </div>
          <div className="flex-1 overflow-y-auto max-h-60 custom-scrollbar bg-bg-card border border-border rounded-md p-2">
            {loadingFriends ? (
              <div className="flex justify-center items-center h-32"><GSpinner /></div>
            ) : filteredFriends.length > 0 ? (
              <FriendsList friends={filteredFriends} onSelectFriend={handleInvite} />
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-text-muted text-sm">
                <Frown className="w-8 h-8 mb-2 opacity-50" />
                {t.lobby.noFriendsFound}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { Lobby };
