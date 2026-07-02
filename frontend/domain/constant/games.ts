import { Orbit, Puzzle, Swords } from "lucide-react";

const games = [
  {
    name: "Snake",
    path: "/snake",
    desc: "Classic arcade — eat & survive",
    icon: Orbit,
    gradient: "from-emerald-400 via-neon-green to-emerald-300",
    color: "text-neon-green",
  },
  {
    name: "Tic Tac Toe",
    path: "/tic-tac-toe",
    desc: "3×3 tactical duel",
    icon: Puzzle,
    gradient: "from-cyan-400 via-neon-cyan to-cyan-300",
    color: "text-neon-cyan",
  },
  {
    name: "Pong",
    path: "/pong",
    desc: "Retro table tennis",
    icon: Swords,
    gradient: "from-violet-400 via-neon-magenta to-violet-300",
    color: "text-neon-magenta",
  },
];

export { games };
