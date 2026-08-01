import type { HTMLAttributes, ReactNode } from "react";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

interface GCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariantEnum;
  padding?: SizeEnum;
  rounded?: SizeEnum;
  children: ReactNode;
}

export type { GCardProps };
