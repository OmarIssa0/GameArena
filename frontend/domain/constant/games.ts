import { Orbit, Puzzle, Swords } from "lucide-react";
import { GamesKindEnum } from "../enum/GamesKindEnum";

// type GameId = "snake" | "ticTacToe" | "pong";

const GamesList = [
  {
    name: "ticTacToe",
    description: "ticTacToeDesc",
    type: GamesKindEnum.TicTacToe,

    icon: Puzzle,
    path: "tic-tac-toe",
    gradient: "play-cyan",
  },
  {
    name: "snake",
    description: "snakeDesc",
    type: GamesKindEnum.Snake,
    path: "snake",
    icon: Orbit,
    gradient: "play-green",
  },
  {
    name: "pong",
    description: "pongDesc",
    type: GamesKindEnum.PingPong,
    path: "ping-pong",
    icon: Swords,
    gradient: "play-magenta",
  },
] as const;
export { GamesList };
