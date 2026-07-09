import type { ReactNode } from "react";
import type { GGradient, GSize, GRounded } from "../tokens";

interface GIconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gradient?: GGradient;
  size?: GSize;
  rounded?: GRounded;
}

export type { GIconTileProps };
