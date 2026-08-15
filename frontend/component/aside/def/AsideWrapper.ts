import type { IAsideConfig } from "../AsideTypes";

interface IAsideWrapperProps {
  config: IAsideConfig;
  collapsed: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export type { IAsideWrapperProps };
