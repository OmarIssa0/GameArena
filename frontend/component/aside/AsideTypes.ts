/**
 * Shared types for aside (sidebar / social panel) components.
 */

export type AsidePlacement = "start" | "end";

export interface AsideConfig {
  /** Placement: start (sidebar/left) or end (social panel/right) */
  placement: AsidePlacement;
  /** Width when expanded (e.g. "w-60" or "w-80") */
  expandedWidth: string;
  /** Width when collapsed (e.g. "w-20") */
  collapsedWidth: string;
  /** Accessible label for the aside element */
  label: string;
  /** Icon for the mobile FAB button */
  mobileIcon: React.ReactNode;
}

export interface AsideState {
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
