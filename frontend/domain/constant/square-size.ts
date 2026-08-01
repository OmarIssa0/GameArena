import { SizeEnum } from "../enum/SizeEnum";
import type { THashMap } from "../type/TCommon";

const squareSize: THashMap<string> = {
  [SizeEnum.xs]: "w-8 h-8",
  [SizeEnum.sm]: "w-12 h-12",
  [SizeEnum.md]: "w-16 h-16",
  [SizeEnum.lg]: "w-24 h-24",
  [SizeEnum.xl]: "w-40 h-40",
};

export { squareSize };
