import type { AsidePlacementEnum } from "@/domain/enum/AsidePlacementEnum";

interface AsideConfig {
  placement: AsidePlacementEnum;
  expandedWidth: string;
  collapsedWidth: string;
  label: string;
  mobileIcon: React.ReactNode;
}

interface AsideState {
  collapsed: boolean;
  open: boolean;
  isDesktop: boolean;
  isCompact: boolean;
  expand: () => void;
  collapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleCollapsed: () => void;
}

export type { AsideConfig, AsideState };
