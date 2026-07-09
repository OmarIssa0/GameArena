import { Orbit, Puzzle, Swords } from "lucide-react";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { GameId } from "@/domain/constant/games";
import type { GGradient } from "@/component/common/tokens";

const matchGameMeta: Record<
  GamesKindEnum,
  {
    gameId: GameId;
    icon: typeof Orbit;
    gradient: GGradient;
    color: "success" | "primary" | "warning";
  }
> = {
  [GamesKindEnum.Snake]: {
    gameId: "snake",
    icon: Orbit,
    gradient: "game-green",
    color: "success",
  },
  [GamesKindEnum.TicTacToe]: {
    gameId: "ticTacToe",
    icon: Puzzle,
    gradient: "game-cyan",
    color: "primary",
  },
  [GamesKindEnum.PingPong]: {
    gameId: "pong",
    icon: Swords,
    gradient: "game-magenta",
    color: "warning",
  },
};

export { matchGameMeta };
