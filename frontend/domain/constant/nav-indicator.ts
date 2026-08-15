import { IndicatorPositionEnum } from "../enum/IndicatorPositionEnum";

type TNavIndicator = { active: string; idle: string };

export const navIndicator: Record<IndicatorPositionEnum, TNavIndicator> = {
  [IndicatorPositionEnum.Start]: {
    active: "border-s-[3px] border-s-primary",
    idle: "border-s-[3px] border-s-transparent",
  },
  [IndicatorPositionEnum.Top]: {
    active: "border-t-[3px] border-t-primary",
    idle: "border-t-[3px] border-t-transparent",
  },
};
