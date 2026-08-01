import clsx from "clsx";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { GCardProps } from "./def/GCard";
import { THashMap } from "@/domain/type/TCommon";

const variants: Record<CardVariantEnum, string> = {
  [CardVariantEnum.Default]: "bg-bg-card border border-border transition-all duration-300",
  [CardVariantEnum.Elevated]: "bg-bg-elevated border border-border transition-all duration-300 hover:border-border-light",
  [CardVariantEnum.Glass]: "bg-bg-card border border-border transition-all duration-300 hover:border-border-light",
  [CardVariantEnum.Interactive]:
    "bg-bg-card border border-border transition-all duration-300 hover:border-border-light hover:bg-bg-card-hover hover:-translate-y-0.5 cursor-pointer",
  [CardVariantEnum.Outlined]: "bg-transparent border border-border-light transition-all duration-300 hover:border-border",
  [CardVariantEnum.Gradient]:
    "bg-bg-card border border-border relative before:content-[''] before:absolute before:-inset-[1px] before:rounded-[inherit] before:bg-gradient-to-br before:from-primary before:via-secondary before:to-accent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
};

const paddings: THashMap<string> = {
  [SizeEnum.None]: "",
  [SizeEnum.sm]: "p-3",
  [SizeEnum.md]: "p-4",
  [SizeEnum.lg]: "p-6",
  [SizeEnum.xl]: "p-8",
};

const roundedStyles: THashMap<string> = {
  [SizeEnum.None]: "rounded-none",
  [SizeEnum.sm]: "rounded-[var(--radius-sm)]",
  [SizeEnum.md]: "rounded-[var(--radius-md)]",
  [SizeEnum.lg]: "rounded-[var(--radius-lg)]",
  [SizeEnum.xl]: "rounded-[var(--radius-xl)]",
  [SizeEnum.full]: "rounded-full",
};

function GCard({
  variant = CardVariantEnum.Default,
  padding = SizeEnum.md,
  rounded: roundedProp = SizeEnum.lg,
  className,
  children,
  ...props
}: GCardProps) {
  return (
    <div className={clsx(variants[variant], paddings[padding], roundedStyles[roundedProp], className)} {...props}>
      {children}
    </div>
  );
}

export { GCard };
