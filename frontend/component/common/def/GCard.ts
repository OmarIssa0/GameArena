import type { HTMLAttributes, ReactNode } from "react";
import type { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariantEnum;
  padding?: SizeEnum;
  rounded?: SizeEnum;
  children: ReactNode;
}

export type { IGCardProps };
