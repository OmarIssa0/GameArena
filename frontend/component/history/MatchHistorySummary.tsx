"use client";

import { Trophy, Frown, Handshake } from "lucide-react";
import { GStatCard } from "@/component/common/GStatCard";
import type { MatchHistorySummaryProps } from "./def/MatchHistorySummary";

function MatchHistorySummary({ summary, labels }: MatchHistorySummaryProps) {
  const items = [
    { label: labels.wins, value: summary.wins, icon: Trophy, iconColor: "success" as const },
    { label: labels.losses, value: summary.losses, icon: Frown, iconColor: "danger" as const },
    { label: labels.draws, value: summary.draws, icon: Handshake, iconColor: "primary" as const },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <GStatCard key={item.label} {...item} size="sm" />
      ))}
    </div>
  );
}

export { MatchHistorySummary };
