import type { AsideConfig, AsideState } from "../AsideTypes";

interface AsideWrapperProps {
  config: AsideConfig;
  aside: AsideState;
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  mobileFab?: React.ReactNode;
  className?: string;
}

export type { AsideWrapperProps };