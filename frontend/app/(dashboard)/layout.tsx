"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { SocialPanel } from "@/component/SocialPanel/SocialPanel";
import { ConnectionProvider } from "@/app/providers/ConnectionProvider";
import { GameProvider } from "@/app/providers/GameProvider";
import { DashboardNotificationsProvider } from "@/app/providers/DashboardNotificationsProvider";
import { ActiveGameBanner } from "@/component/games/ActiveGameBanner";
import { NotificationPopup } from "@/component/notification/NotificationPopup";
import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { Sidebar } from "@/component/Sidebar/Sidebar";
import { Header } from "@/component/Header/Header";
import { MobileFooter } from "@/component/MobileFooter/MobileFooter";
import { useAside } from "@/hooks/useAside";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const sidebarAside = useAside(false);
  const socialAside = useAside(false);

  useEffect(() => {
    if (!loading && !user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-bg items-center justify-center">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  return (
    <ConnectionProvider>
      <GameProvider>
        <DashboardNotificationsProvider>
          <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg font-sans text-text antialiased">
            <Header sidebar={sidebarAside} social={socialAside} />
            <div className="flex min-h-0 flex-1 pt-14">
              <Sidebar aside={sidebarAside} />
              <main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-mobile-nav md:pb-0 custom-scrollbar">{children}</main>
              <SocialPanel aside={socialAside} />
            </div>
            <MobileFooter />
          </div>
          <NotificationPopup />
          <ActiveGameBanner />
        </DashboardNotificationsProvider>
      </GameProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
