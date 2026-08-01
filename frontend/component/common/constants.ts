import { SizeEnum } from "@/domain/enum/SizeEnum";
import { THashMap } from "@/domain/type/TCommon";

export const INPUT_SIZES: THashMap<string> = {
  [SizeEnum.xs]: "px-2.5 py-1.5 text-xs",
  [SizeEnum.sm]: "px-3 py-2 text-sm",
  [SizeEnum.md]: "px-4 py-2.5 text-sm",
  [SizeEnum.lg]: "px-4 py-3 text-base",
  [SizeEnum.xl]: "px-4 py-3.5 text-base",
  [SizeEnum.icon]: "px-4 py-3.5 text-base",
};

export const FIELD_BASE_CLASS = `
  w-full bg-surface border border-border rounded-[var(--radius-md)] text-text transition-all duration-150
  hover:border-border-light focus:border-primary focus:ring-3 focus:ring-primary-muted
  placeholder:text-text-muted
`;