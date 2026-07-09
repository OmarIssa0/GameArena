"use client";

import { useTicTacToe } from "@/hooks/useTicTacToe";
import { useAuth } from "@/app/providers/AuthProvider";
import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TicTacToeTranslations } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { Sparkles, UserPlus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { TNullable } from "@/domain/type/TCommon";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { GTabItem } from "@/component/common/def/GTabs";
import { Lobby, type LobbyTab } from "@/component/games/tic-tac-toe/Lobby";
import { MatchWaiting } from "@/component/games/tic-tac-toe/MatchWaiting";
import { InviteFriend } from "@/component/games/tic-tac-toe/InviteFriend";
import { GameFound } from "@/component/games/tic-tac-toe/GameFound";
import { GameBoard } from "@/component/games/tic-tac-toe/GameBoard";

function TicTacToePage() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as TicTacToeTranslations;
  const {
    board, gameState, roomId, isSearching, isConnected, opponentDisconnected,
    isBotGame, isMyTurn, findMatch, inviteFriend, inviteToRoom,
    makeMove, resetGame, startGame, leaveGame,
  } = useTicTacToe();

  const [lobbyTab, setLobbyTab] = useState<LobbyTab>("quick");
  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [friends, setFriends] = useState<IUserSummary[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const opponentName = isBotGame
    ? "AI Bot"
    : gameState?.player1Id === user?.id
      ? gameState?.player2Username || t.game.opponent
      : gameState?.player1Username || t.game.opponent;
  const myName = user?.userName || t.game.you;

  useEffect(() => {
    let ignore = false;
    if (lobbyTab === "invite" && friends.length === 0) {
      setLoadingFriends(true);
      friendService
        .getFriends({ name: null, userStatus: UserStatusEnum.All })
        .then((res: IApiResponse<IUserSummary[]>) => {
          if (!ignore) setFriends(res.data ?? []);
        })
        .catch(() => {})
        .finally(() => {
          if (!ignore) setLoadingFriends(false);
        });
    }
    return () => { ignore = true; };
  }, [lobbyTab, friends.length]);

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) =>
      `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term),
    );
  }, [friends, searchQuery]);

  const handleCellClick = (index: number) => {
    if (!gameState || gameState.isFinished) return;
    if (!isMyTurn) return;
    if (board[index] === "X" || board[index] === "O") return;
    makeMove(index);
  };

  const startGameNew = (friendId: TNullable<string> = null) => {
    if (!gameState || user?.id !== gameState.player1Id) return;
    startGame(friendId ?? gameState.player2Id ?? null);
  };

  const handleInvite = (friendId: string) => {
    inviteFriend(friendId);
    setLobbyTab("quick");
  };

  const lobbyTabs = useMemo<GTabItem<LobbyTab>[]>(
    () => [
      { id: "quick", label: t.lobby.tabs.quick, icon: <Sparkles className="w-4 h-4" /> },
      { id: "invite", label: t.lobby.tabs.invite, icon: <UserPlus className="w-4 h-4" /> },
    ],
    [t],
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full py-8 px-4 md:px-8">
      {!roomId && (
        <Lobby
          isSearching={isSearching}
          isConnected={isConnected}
          lobbyTab={lobbyTab}
          setLobbyTab={setLobbyTab}
          lobbyTabs={lobbyTabs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredFriends={filteredFriends}
          loadingFriends={loadingFriends}
          findMatch={findMatch}
          handleInvite={handleInvite}
          resetGame={resetGame}
          t={t}
        />
      )}

      {roomId && !gameState?.player2Id && (
        <>
          <MatchWaiting
            gameState={gameState}
            user={user}
            myName={myName}
            t={t}
            onStartVsAI={() => startGameNew(null)}
            onInviteFriend={() => setShowInvitePicker(true)}
            onCancel={resetGame}
          />
          <InviteFriend
            open={showInvitePicker}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loadingFriends}
            friends={filteredFriends}
            onSelect={(friendId) => { inviteToRoom(friendId); setShowInvitePicker(false); }}
            onClose={() => setShowInvitePicker(false)}
          />
        </>
      )}

      {roomId && gameState?.player2Id && !gameState.hasStarted && (
        <GameFound
          gameState={gameState}
          user={user}
          t={t}
          onStart={(opponentId) => startGameNew(opponentId)}
        />
      )}

      {roomId && gameState?.player2Id && gameState.hasStarted && (
        <GameBoard
          board={board}
          gameState={gameState}
          user={user}
          isMyTurn={isMyTurn}
          isBotGame={isBotGame}
          opponentDisconnected={opponentDisconnected}
          myName={myName}
          opponentName={opponentName}
          t={t}
          onCellClick={handleCellClick}
          onPlayAgain={findMatch}
          onLobby={resetGame}
          onLeave={leaveGame}
        />
      )}
    </div>
  );
}

export default TicTacToePage;
