type TLocale = "en" | "ar";

type TSetLocale = (locale: TLocale) => void;

type THashMap = Record<string, unknown>;

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
type TFieldRegister =
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "username";
type TFieldLogin = "email" | "password";
export interface TicTacToeGameState {
  roomId: string;
  board: string[];

  currentTurnPlayerId: string;

  winnerPlayerId?: string;
  winnerSymbol?: string;

  isFinished: boolean;

  player1Id: string;
  player1Username: string;

  player2Id?: string;
  player2Username?: string;
}

export type TError = {
  response?: {
    data?: {
      errorCode: ErrorCode;
      success: boolean;
      data?: TNullable<unknown>;
      message?: TNullable<string>;
    };
  };
  status?: number;
};
export type Validator = (value: string) => string | null;

export enum PasswordValidationEnum {
  MinLength,
  MaxLength,
  Number,
  Uppercase,
  Lowercase,
  SpecialChar,
  NoSpaces,
}

export enum ErrorCode {
  None = 0,

  // Auth
  InvalidCredentials = 1001,
  Unauthorized = 1002,
  TokenExpired = 1003,
  EmailNotVerified = 1004,
  RefreshTokenInvalid = 1005,

  // Email verification
  OtpInvalid = 2001,
  OtpExpired = 2002,
  OtpAlreadyUsed = 2003,
  EmailNotFound = 2004,

  // User
  UserNotFound = 3001,
  UserAlreadyExists = 3002,
  NoUsersFound = 3003,
  NoFriendsFound = 3004,

  // General
  ValidationError = 9001,
  ServerError = 9002,
}
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  ErrorCode: ErrorCode;
  message: string;
}

export type {
  TLocale,
  TSetLocale,
  THashMap,
  Callable,
  TTranslate,
  TNullable,
  TFieldRegister,
  TFieldLogin,
};
export { GamesKindEnum };
