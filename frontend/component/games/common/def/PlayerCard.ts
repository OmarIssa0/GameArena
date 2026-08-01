export interface IPlayerCardColors {
  box: string;
  badge: string;
  turn: string;
}

export interface IPlayerCardProps {
  playerId: string | null;
  playerUsername: string | null;
  symbol?: string;
  isBot: boolean;
  fallbackName: string;
  isTurn: boolean;
  symbolColors?: IPlayerCardColors;
}
