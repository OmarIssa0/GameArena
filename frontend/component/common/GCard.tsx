import clsx from "clsx";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { GCardProps } from "./def/GCard";
import { paddingSize, radiusSize } from "@/domain/constant/size-classes";

const variants: Record<CardVariantEnum, string> = {
  [CardVariantEnum.Default]: "bg-bg-card border border-border",
  [CardVariantEnum.Outlined]: "bg-transparent border border-border",
  [CardVariantEnum.Elevated]: "bg-bg-elevated border border-border",
  [CardVariantEnum.Interactive]: "bg-bg-card border border-border hover:bg-bg-card-hover cursor-pointer",
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
    <div className={clsx(variants[variant], paddingSize[padding], radiusSize[roundedProp], className)} {...props}>
      {children}
    </div>
  );
}

export { GCard };
