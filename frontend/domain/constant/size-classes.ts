import { SizeEnum } from "../enum/SizeEnum";
import type { THashMap } from "../type/TCommon";

export const iconSize: THashMap<string> = {
  [SizeEnum.None]: "h-0 w-0",
  [SizeEnum.xs]: "h-3 w-3",
  [SizeEnum.sm]: "h-4 w-4",
  [SizeEnum.md]: "h-5 w-5",
  [SizeEnum.lg]: "h-6 w-6",
  [SizeEnum.xl]: "h-8 w-8",
  [SizeEnum.icon]: "h-11 w-11",
};

export const squareSize: THashMap<string> = {
  [SizeEnum.xs]: "w-8 h-8",
  [SizeEnum.sm]: "w-12 h-12",
  [SizeEnum.md]: "w-16 h-16",
};

export const spinnerSize: THashMap<string> = {
  [SizeEnum.sm]: "h-4 w-4",
  [SizeEnum.md]: "h-6 w-6",
  [SizeEnum.lg]: "h-10 w-10",
};

export const controlSize: THashMap<string> = {
  [SizeEnum.xs]: "h-4 px-2.5 text-xs gap-1",
  [SizeEnum.sm]: "h-8 px-3 text-sm gap-1.5",
  [SizeEnum.md]: "h-12 px-4 text-sm gap-2",
  [SizeEnum.lg]: "h-16 px-5 text-lg gap-2.5",
  [SizeEnum.xl]: "h-20 px-6 text-xl gap-3",
  [SizeEnum.icon]: "h-11 w-11 p-0",
};

export const fieldSize: THashMap<string> = {
  [SizeEnum.sm]: "px-3 py-2 text-sm",
  [SizeEnum.md]: "px-4 py-2.5 text-sm",
  [SizeEnum.xl]: "px-4 py-3.5 text-base",
};

export const paddingSize: THashMap<string> = {
  [SizeEnum.sm]: "p-3",
  [SizeEnum.md]: "p-4",
  [SizeEnum.lg]: "p-6",
  [SizeEnum.xl]: "p-8",
};

export const radiusSize: THashMap<string> = {
  [SizeEnum.None]: "rounded-none",
  [SizeEnum.sm]: "rounded-sm",
  [SizeEnum.md]: "rounded-md",
  [SizeEnum.lg]: "rounded-lg",
  [SizeEnum.xl]: "rounded-xl",
  [SizeEnum.full]: "rounded-full",
};

export const modalSize: THashMap<string> = {
  [SizeEnum.sm]: "max-w-xs",
  [SizeEnum.md]: "max-w-sm",
  [SizeEnum.lg]: "max-w-md",
  [SizeEnum.xl]: "max-w-lg",
};

export const pageSize: THashMap<string> = {
  [SizeEnum.None]: "max-w-3xl",
  [SizeEnum.xs]: "max-w-xl",
  [SizeEnum.sm]: "max-w-2xl",
  [SizeEnum.md]: "max-w-3xl",
  [SizeEnum.lg]: "max-w-6xl",
  [SizeEnum.xl]: "max-w-7xl",
  [SizeEnum.icon]: "max-w-3xl",
  [SizeEnum.full]: "max-w-full",
};

export const fieldBase =
  "w-full bg-surface border border-border rounded-md text-text hover:border-border-light focus:border-primary focus:ring-3 focus:ring-primary-muted placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60";