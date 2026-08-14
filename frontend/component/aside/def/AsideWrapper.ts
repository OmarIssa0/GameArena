import type { AsideConfig } from "../AsideTypes";

interface AsideWrapperProps {
  config: AsideConfig;
  collapsed: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export type { AsideWrapperProps };