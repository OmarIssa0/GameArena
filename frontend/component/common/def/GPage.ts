import type { ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface GPageProps {
  children: ReactNode;
  size?: SizeEnum;
  className?: string;
}

export type { GPageProps };
