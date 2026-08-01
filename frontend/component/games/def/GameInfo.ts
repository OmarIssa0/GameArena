import type { IPlayerCardColors } from "@/component/games/common/def/PlayerCard";

export interface IGameInfo {
  name: string;
  description: string;
  symbol1: string;
  symbol2: string;
  player1Colors: IPlayerCardColors;
  player2Colors: IPlayerCardColors;
}
