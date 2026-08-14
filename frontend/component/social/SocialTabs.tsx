"use client";

import { useMemo } from "react";
import { Users, Bell } from "lucide-react";
import { GTabs } from "@/component/common/GTabs";
import { GIcon } from "@/component/common/GIcon";
import type { GTabItem } from "@/component/common/def/GTabs";
import { SizeEnum } from "@/domain/enum/SizeEnum";

enum SocialTabId {
  Friends = "friends",
  Notifications = "notifications",
}

interface SocialTabsProps {
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

function SocialTabs({ value, onChange, labels, badges }: SocialTabsProps) {
  const tabs = useMemo<GTabItem<SocialTabId>[]>(
    () => [
      {
        id: SocialTabId.Friends,
        label: labels.friends,
        icon: <GIcon icon={Users} size={SizeEnum.sm} />,
        badge: badges?.friends,
      },
      {
        id: SocialTabId.Notifications,
        label: labels.notifications,
        icon: <GIcon icon={Bell} size={SizeEnum.sm} />,
        badge: badges?.notifications,
      },
    ],
    [labels, badges],
  );

  return (
    <GTabs
      tabs={tabs}
      value={value}
      onChange={(id) => onChange(id as SocialTabId)}
      fullWidth
    />
  );
}

export { SocialTabs, SocialTabId };