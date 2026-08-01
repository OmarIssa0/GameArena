export interface IAsideHeaderProps {
  aside: {
    collapsed: boolean;
    isDesktop: boolean;
    open: boolean;
    expand: () => void;
    collapse: () => void;
    closeMobile: () => void;
  };
  brand: React.ReactNode;
  collapsedIcon: React.ReactNode;
  label: string;
  actions?: React.ReactNode;
}
