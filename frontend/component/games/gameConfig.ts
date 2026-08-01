import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IGameInfo } from "./def/GameInfo";
import type { GameTranslations } from "@/component/i18n/Game/en.i18n";

const gameConfigs: Partial<Record<GamesKindEnum, IGameInfo>> = {
  [GamesKindEnum.TicTacToe]: {
    name: "tictactoe.name",
    description: "tictactoe.description",
    symbol1: "X",
    symbol2: "O",
    player1Colors: {
      box: "border-accent bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
    player2Colors: {
      box: "border-warning bg-warning-bg",
      badge: "bg-warning",
      turn: "text-warning",
    },
  },
  [GamesKindEnum.PingPong]: {
    name: "pingpong.name",
    description: "pingpong.description",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: {
      box: "border-accent bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
    player2Colors: {
      box: "border-warning bg-warning-bg",
      badge: "bg-warning",
      turn: "text-warning",
    },
  },
  [GamesKindEnum.Snake]: {
    name: "snake.name",
    description: "snake.description",
    symbol1: "P1",
    symbol2: "P2",
    player1Colors: {
      box: "border-neon-green bg-success-bg",
      badge: "bg-success",
      turn: "text-success",
    },
    player2Colors: {
      box: "border-neon-magenta bg-accent-muted",
      badge: "bg-accent",
      turn: "text-accent",
    },
  },
};

function getGameConfig(gameType: GamesKindEnum): IGameInfo {
  const config = gameConfigs[gameType];
  if (!config) throw new Error(`No game config found for game type: ${gameType}`);
  return config;
}

function translateGameInfo(t: GameTranslations, gameType: GamesKindEnum): { name: string; description: string } {
  const info = getGameConfig(gameType);
  const lookup = (key: string): string => (t as unknown as Record<string, unknown>)[key] as string;
  return { name: lookup(info.name), description: lookup(info.description) };
}

export { getGameConfig, translateGameInfo, type IGameInfo };
