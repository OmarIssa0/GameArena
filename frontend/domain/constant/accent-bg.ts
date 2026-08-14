import { AccentColorEnum } from "../enum/AccentColorEnum";
import { AccentBackGroundEnum } from "../enum/AccentBackGroundEnum";

export const accentBg: Record<AccentColorEnum, AccentBackGroundEnum> = {
  [AccentColorEnum.Primary]: AccentBackGroundEnum.PrimaryMuted,
  [AccentColorEnum.Secondary]: AccentBackGroundEnum.SecondaryMuted,
  [AccentColorEnum.Muted]: AccentBackGroundEnum.Surface,
  [AccentColorEnum.Success]: AccentBackGroundEnum.SuccessBg,
  [AccentColorEnum.Warning]: AccentBackGroundEnum.WarningBg,
  [AccentColorEnum.Danger]: AccentBackGroundEnum.ErrorMuted,
  [AccentColorEnum.OnPrimary]: AccentBackGroundEnum.Surface,
  [AccentColorEnum.Accent]: AccentBackGroundEnum.AccentMuted,
  [AccentColorEnum.Inherit]: AccentBackGroundEnum.Surface,
};

export const accentHoverBg: Record<AccentColorEnum, string> = {
  [AccentColorEnum.Primary]: "hover:bg-primary",
  [AccentColorEnum.Secondary]: "hover:bg-text-secondary",
  [AccentColorEnum.Muted]: "hover:bg-text-muted",
  [AccentColorEnum.Success]: "hover:bg-success",
  [AccentColorEnum.Warning]: "hover:bg-warning",
  [AccentColorEnum.Danger]: "hover:bg-danger",
  [AccentColorEnum.OnPrimary]: "hover:bg-surface-hover",
  [AccentColorEnum.Accent]: "hover:bg-accent",
  [AccentColorEnum.Inherit]: "hover:bg-surface-hover",
};
