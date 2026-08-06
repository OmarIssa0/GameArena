import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { LucideIcon } from "lucide-react";
import { Grid3X3, Volleyball, Worm, Hand } from "lucide-react";
import type { IPlayerCardColors } from "@/component/games/def/GameUI";
import type { GameTranslations } from "@/component/i18n/Game/en.i18n";

export interface IGameConfig {
  id: string;
  type: GamesKindEnum;
  icon: LucideIcon;
  path: string;
  gradient: string; // CSS text color, e.g. "text-primary"
  gradientClass: string; // gradient class for tiles, e.g. "from-primary to-acent"
  animation: string;
  symbol1: string;
  symbol2: string;
  player1Colors: IPlayerCardColors;
  player2Colors: IPlayerCardColors;
  needsInput: boolean; // does this game require keyboard input during play?
  nameKey: string;
  descriptionKey: string;
}

const gameConfigs: Record<GamesKindEnum, IGameConfig> = {
  [GamesKindEnum.TicTacToe]: {
    id: "tictactoe",
    type: GamesKindEnum.TicTacToe,
    icon: Grid3X3,
    path: "tic-tac-toe",
    gradient: "text-primary",
    gradientClass: "from-primary to-accent",
    animation: "/tic_tac_toe_1.json",
    symbol1: "X",
    symbol2: "O",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "tictactoe.name",
    descriptionKey: "tictactoe.description",
  },
  [GamesKindEnum.PingPong]: {
    id: "pingpong",
    type: GamesKindEnum.PingPong,
    icon: Volleyball,
    path: "ping-pong",
    gradient: "text-success",
    gradientClass: "from-success to-secondary",
    animation: "/ping-pong.json",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: true,
    nameKey: "pingpong.name",
    descriptionKey: "pingpong.description",
  },
  [GamesKindEnum.Snake]: {
    id: "snake",
    type: GamesKindEnum.Snake,
    icon: Worm,
    path: "snake",
    gradient: "text-success",
    gradientClass: "from-success to-secondary",
    animation: "/Snake.json",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: { box: "border-neon-green bg-success-bg", badge: "bg-success", turn: "text-success" },
    player2Colors: { box: "border-neon-magenta bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    needsInput: true,
    nameKey: "snake.name",
    descriptionKey: "snake.description",
  },
  [GamesKindEnum.RockPaperScissors]: {
    id: "rockpaperscissors",
    type: GamesKindEnum.RockPaperScissors,
    icon: Hand,
    path: "rock-paper-scissors",
    gradient: "text-primary",
    gradientClass: "from-primary to-accent",
    animation: "/rock_paper_scissors.json",
    symbol1: "✊",
    symbol2: "✌️",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "rockpaperscissors.name",
    descriptionKey: "rockpaperscissors.description",
  },
  [GamesKindEnum.ConnectFour]: {
    id: "connectfour",
    type: GamesKindEnum.ConnectFour,
    icon: Grid3X3,
    path: "connect-four",
    gradient: "text-primary",
    gradientClass: "from-primary to-accent",
    animation: "/connect_four.json",
    symbol1: "🔴",
    symbol2: "🟡",
    player1Colors: { box: "border-accent bg-accent-muted", badge: "bg-accent", turn: "text-accent" },
    player2Colors: { box: "border-warning bg-warning-bg", badge: "bg-warning", turn: "text-warning" },
    needsInput: false,
    nameKey: "connectfour.name",
    descriptionKey: "connectfour.description",
  },
};

export const GAMES_BY_TYPE = gameConfigs;

export const GamesList: IGameConfig[] = Object.values(gameConfigs);

export const GamesMap: Record<string, IGameConfig> = Object.fromEntries(GamesList.map((g) => [g.id, g]));

/** Defaults shared by all games. */
export const GAME_DEFAULTS = {
  MIN_PLAYERS: 1,
  MAX_PLAYERS: 2,
  TIMEOUT: 30000,
  RECONNECT_ATTEMPTS: 3,
} as const;

export function getGameConfig(gameType: GamesKindEnum): IGameConfig {
  const config = gameConfigs[gameType];
  if (!config) throw new Error(`No game config found for game type: ${gameType}`);
  return config;
}

/** Translate game name/description using the unified Game i18n. */
export function translateGameInfo(t: GameTranslations, gameType: GamesKindEnum): { name: string; description: string } {
  const config = getGameConfig(gameType);
  const lookup = (key: string): string => (t as unknown as Record<string, unknown>)[key] as string;
  return { name: lookup(config.nameKey), description: lookup(config.descriptionKey) };
}

export { GamesKindEnum };
