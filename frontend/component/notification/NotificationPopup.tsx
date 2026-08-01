"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GIcon } from "@/component/common/GIcon";
import { X, Bell } from "lucide-react";
import { GButton } from "../common/GButton";
import type { TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function NotificationPopup() {
  const router = useRouter();
  const { notifications } = useDashboardNotifications();
  const [visible, setVisible] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);
  const lastIdRef = useRef<TNullable<string>>(null);

  // Get the latest non-dismissed notification
  const latest = notifications.length > 0 ? (notifications.find((n) => !dismissedIds.has(n.id)) ?? notifications[0]) : null;

  // Track visibility via ref to avoid cascading renders from setState in effect
  const visibleRef = useRef(false);

  useEffect(() => {
    if (!latest) {
      visibleRef.current = false;
      return;
    }

    if (latest.id === lastIdRef.current) return;
    lastIdRef.current = latest.id;

    // Show the popup
    visibleRef.current = true;
    setVisible(true);

    // Auto-dismiss after 5 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [latest]);

  if (!visible || !latest) return null;

  const handleClick = () => {
    setVisible(false);
    router.push("/notifications");
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set(prev).add(latest.id));
    setVisible(false);
  };

  return (
    <div className="fixed top-4 start-1/2 -translate-x-1/2 z-[var(--z-popover)] animate-in">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className="flex items-center gap-3 bg-bg-elevated border border-primary/30 rounded-2xl shadow-xl shadow-primary/10 px-5 py-3 cursor-pointer transition hover:bg-bg-card-hover hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary outline-none max-w-[90vw] sm:max-w-md">
        <div className="p-1.5 bg-primary-muted rounded-full shrink-0">
          <GIcon icon={Bell} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
        </div>
        <div className="min-w-0 flex-1 text-start">
          <p className="text-sm font-semibold text-text truncate">{latest.title}</p>
          <p className="text-xs text-text-secondary truncate">{latest.body}</p>
        </div>
        <GButton variant={AccentColorEnum.Muted} size={SizeEnum.icon} onClick={handleDismiss} className="shrink-0 min-w-[32px] min-h-[32px]" aria-label="Dismiss">
          <GIcon icon={X} size={SizeEnum.sm} color={AccentColorEnum.Muted} />
        </GButton>
      </div>
    </div>
  );
}

export { NotificationPopup };
