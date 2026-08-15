import type { SocialTabId } from "../SocialTabs";

interface ISocialTabsProps {
  value: SocialTabId;
  onChange: (tabId: SocialTabId) => void;
  labels: {
    friends: string;
    notifications: string;
  };
  badges?: {
    friends?: number;
    notifications?: number;
  };
}

export type { ISocialTabsProps };
