// app/i18n/types/index.ts

type TLocale = "en" | "ar";

type TSetLocale = (locale: TLocale) => void;

type THashMap = Record<string, any>;

type TTranslate = { en: THashMap; ar: THashMap };
type TNullable<T> = T | null;

type Callable<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends string
      ? () => string
      : T[K] extends object
        ? Callable<T[K]>
        : never;
};
enum GamesKindEnum {
  TicTacTao,
}
export interface GameState {
  roomId: string;
  board: TNullable<string>[];
  currentTurnPlayerId: string;
  winnerPlayerId: TNullable<string>;
  winnerSymbol: string;
  isFinished: boolean;
  player1Id: string;
  player1Username?: string;
  player2Id: string;
  player2Username?: string;
}

export type { TLocale, TSetLocale, THashMap, Callable, TTranslate };
export { GamesKindEnum };
