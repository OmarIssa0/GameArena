export interface IAsideHeaderProps {
  collapsed: boolean;
  expand: () => void;
  collapse: () => void;
  closeMobile?: () => void;
  brand: React.ReactNode;
  collapsedIcon: React.ReactNode;
  label: string;
  actions?: React.ReactNode;
  overlay?: boolean;
}