interface ISocialPanelHeaderProps {
  title: string;
  onlineCount?: number;
  onlineLabel?: string;
  onClose?: () => void;
  showClose?: boolean;
}

export type { ISocialPanelHeaderProps };
