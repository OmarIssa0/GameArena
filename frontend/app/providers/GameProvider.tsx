"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { gameService } from "@/services/def/GameService";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IGameState } from "./def/IGameState";
import type { IGameContext } from "./def/IGameContext";
import { useRouter } from "next/navigation";

const GameContext = createContext<TNullable<IGameContext>>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { isGameConnected } = useConnections();
  const [state, setState] = useState<TNullable<IGameState>>(null);
  const [isSearching, setIsSearching] = useState(false);
  const isSearchingRef = useRef(false);
  const [searchError, setSearchError] = useState<TNullable<string>>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [lastGameType, setLastGameType] = useState<TNullable<GamesKindEnum>>(null);
  const [pendingPlayAgainRequest, setPendingPlayAgainRequest] = useState<TNullable<{ requesterId: string; requesterUsername: string }>>(null);
  const [requestedPlayAgain, setRequestedPlayAgain] = useState(false);
  const router = useRouter();

  const clearFlags = useCallback(() => {
    isSearchingRef.current = false;
    setIsSearching(false);
    setSearchError(null);
    setOpponentDisconnected(false);
    setPendingPlayAgainRequest(null);
    setRequestedPlayAgain(false);
  }, []);

  const goToLobby = useCallback(() => {
    setState(null);
    clearFlags();
    router.push("/games");
  }, [router, clearFlags]);

  // ── SignalR subscriptions via service ───────────────────────────────
  useEffect(() => {
    const offState = gameService.onGameState((value) => {
      setState(value);
      clearFlags();
    });

    const offDisconnect = gameService.onOpponentDisconnect(() => {
      setOpponentDisconnected(true);
      setPendingPlayAgainRequest(null);
      setRequestedPlayAgain(false);
    });

    const offPlayAgainReq = gameService.onPlayAgainRequest((data) => {
      setPendingPlayAgainRequest(data);
    });

    const offPlayAgainRes = gameService.onPlayAgainResponse((data) => {
      setRequestedPlayAgain(false);
      if (!data.accepted) {
        goToLobby();
      }
    });

    return () => {
      offState();
      offDisconnect();
      offPlayAgainReq();
      offPlayAgainRes();
    };
  }, [goToLobby, clearFlags]);

  // ── Actions ─────────────────────────────────────────────────────────
  const findMatch = useCallback(
    async (game: GamesKindEnum) => {
      if (isSearchingRef.current) return;
      setState(null);
      clearFlags();
      isSearchingRef.current = true;
      setLastGameType(game);
      setSearchError(null);
      setIsSearching(true);
      try {
        await gameService.findMatch(game);
      } catch {
        isSearchingRef.current = false;
        setIsSearching(false);
        setSearchError("Failed to find a match. Please try again.");
      }
    },
    [clearFlags],
  );

  const startGame = useCallback(async (friendId: TNullable<string>, gameKind: GamesKindEnum) => {
    setLastGameType(gameKind);
    await gameService.startGame(friendId, gameKind);
  }, []);

  const inviteFriend = useCallback(async (friendId: string, game: GamesKindEnum) => {
    await gameService.inviteFriend(friendId, game);
  }, []);

  const inviteToRoom = useCallback(async (friendId: string) => {
    await gameService.inviteToRoom(friendId);
  }, []);

  const leaveGame = useCallback(async () => {
    try {
      await gameService.leaveGame();
    } catch {
      /* navigate regardless */
    }
    goToLobby();
  }, [goToLobby]);

  const requestPlayAgain = useCallback(async () => {
    setRequestedPlayAgain(true);
    try {
      await gameService.requestPlayAgain();
    } catch {
      setRequestedPlayAgain(false);
    }
  }, []);

  // ── Timeout: reset requestedPlayAgain after 30s ─────────────────────
  useEffect(() => {
    if (!requestedPlayAgain) return;
    const timer = setTimeout(() => {
      setRequestedPlayAgain(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [requestedPlayAgain]);

  const respondPlayAgain = useCallback(
    async (accept: boolean) => {
      try {
        await gameService.respondPlayAgain(accept);
        setPendingPlayAgainRequest(null);
        if (!accept) goToLobby();
      } catch {
        // keep dialog open so user can retry or use Go to Lobby
      }
    },
    [goToLobby],
  );

  const resetGame = useCallback(async () => {
    try {
      if (isSearching) await gameService.cancelSearch();
    } catch {
      /* ignore */
    }
    try {
      await gameService.leaveGame();
    } catch {
      /* navigate regardless */
    }
    goToLobby();
  }, [goToLobby, isSearching]);

  const createLobby = useCallback(async (gameKind: GamesKindEnum) => {
    setLastGameType(gameKind);
    try {
      await gameService.createLobby(gameKind);
    } catch {
      setSearchError("Failed to create lobby. Please try again.");
    }
  }, []);

  const sendAction = useCallback(async (action: object) => {
    // Do NOT await SignalR invoke here; awaiting per-frame creates backpressure/latency.
    void gameService.sendAction(action).catch((err) => {
      console.error("Failed to send game action:", err);
    });
  }, []);

  const value = useMemo<IGameContext>(
    () => ({
      state,
      isConnected: isGameConnected,
      isSearching,
      searchError,
      opponentDisconnected,
      lastGameType,
      pendingPlayAgainRequest,
      requestedPlayAgain,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      requestPlayAgain,
      respondPlayAgain,
      resetGame,
      createLobby,
      sendAction,
    }),
    [
      state,
      isGameConnected,
      isSearching,
      searchError,
      opponentDisconnected,
      pendingPlayAgainRequest,
      requestedPlayAgain,
      lastGameType,
      findMatch,
      startGame,
      inviteFriend,
      inviteToRoom,
      leaveGame,
      requestPlayAgain,
      respondPlayAgain,
      resetGame,
      createLobby,
      sendAction,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
