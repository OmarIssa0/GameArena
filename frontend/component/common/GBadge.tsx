import clsx from "clsx";
import type { GBadgeProps } from "./def/GBadge";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AccentBackGroundEnum } from "@/domain/enum/AccentBackGroundEnum";
import type { THashMap } from "@/domain/type/TCommon";

const badgeBgColors: Record<AccentColorEnum, AccentBackGroundEnum> = {
  [AccentColorEnum.Primary]: AccentBackGroundEnum.PrimaryMuted,
  [AccentColorEnum.Secondary]: AccentBackGroundEnum.SecondaryMuted,
  [AccentColorEnum.Muted]: AccentBackGroundEnum.Surface,
  [AccentColorEnum.Success]: AccentBackGroundEnum.SuccessBg,
  [AccentColorEnum.Warning]: AccentBackGroundEnum.WarningBg,
  [AccentColorEnum.Danger]: AccentBackGroundEnum.ErrorMuted,
  [AccentColorEnum.Inherit]: AccentBackGroundEnum.Surface,
  [AccentColorEnum.OnPrimary]: AccentBackGroundEnum.Surface,
  [AccentColorEnum.Accent]: AccentBackGroundEnum.AccentMuted,
  [AccentColorEnum.Text]: AccentBackGroundEnum.Surface,
};

const sizes: THashMap<string> = {
  [SizeEnum.xs]: "text-2xs",
  [SizeEnum.sm]: "text-2xs",
  [SizeEnum.md]: "",
  [SizeEnum.lg]: "",
  [SizeEnum.xl]: "",
  [SizeEnum.icon]: "",
};

const badgeBase = "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap";

function GBadge({ variant = AccentColorEnum.Primary, size = SizeEnum.md, className, children, ...props }: GBadgeProps) {
  return (
    <span className={clsx(badgeBase, badgeBgColors[variant], variant, sizes[size], variant === AccentColorEnum.Secondary && "border border-border", className)} {...props}>
      {children}
    </span>
  );
}

export { GBadge };
