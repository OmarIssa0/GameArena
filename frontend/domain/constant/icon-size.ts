import { SizeEnum } from "../enum/SizeEnum";
import type { THashMap } from "../type/TCommon";

const IConSIZE: THashMap = {
  [SizeEnum.None]: "h-0 w-0",
  [SizeEnum.xs]: "h-3 w-3",
  [SizeEnum.sm]: "h-4 w-4",
  [SizeEnum.md]: "h-5 w-5",
  [SizeEnum.lg]: "h-6 w-6",
  [SizeEnum.xl]: "h-8 w-8",
  [SizeEnum.icon]: "h-11 w-11",
};

export { IConSIZE };
