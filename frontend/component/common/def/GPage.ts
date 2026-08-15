import type { ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGPageProps {
  children: ReactNode;
  size?: SizeEnum;
  className?: string;
}

export type { IGPageProps };
