import { useEffect, useState } from "react";
import { useConnection } from "./useConnection";
import { GamesKindEnum, GameState } from "@/types";

function useTicTacToe() {
  const { connection, isConnected } = useConnection("gameHub");

  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  useEffect(() => {
    if (!connection) return;

    const handleGameStateRoom = (state: GameState) => {
      setRoomId(state.roomId);
      setIsSearching(false);
      setGameState(state);
      setOpponentDisconnected(false);
    };

    const handleDisconnect = () => {
      setOpponentDisconnected(true);
      setGameState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isFinished: true,
        };
      });
    };

    connection.on("gameState", handleGameStateRoom);
    connection.on("OpponentDisconnected", handleDisconnect);

    return () => {
      connection.off("gameState", handleGameStateRoom);
      connection.off("OpponentDisconnected", handleDisconnect);
    };
  }, [connection]);

  const findMatch = async () => {
    if (!connection || !isConnected) return;

    setIsSearching(true);
    setOpponentDisconnected(false);
    setGameState(null);
    setRoomId(null);

    await connection.invoke("FindMatch", GamesKindEnum.TicTacTao);
  };

  const makeMove = async (cell: number) => {
    if (!connection || !roomId) return;
    await connection.invoke("SendAction", "MAKE_MOVE", cell.toString());
  };

  const resetGame = () => {
    setRoomId(null);
    setGameState(null);
    setIsSearching(false);
    setOpponentDisconnected(false);
  };

  return {
    board: gameState?.board ?? Array(9).fill(""),
    gameState,
    roomId,
    isSearching,
    isConnected,
    opponentDisconnected,
    findMatch,
    makeMove,
    resetGame,
  };
}

export { useTicTacToe };
