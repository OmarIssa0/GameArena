"use client";

import { useMemo } from "react";
import { Hexagon, PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAside } from "@/hooks/useAside";
import { useNavigation } from "@/hooks/useNavigation";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { GNav } from "@/component/common/GNav";
import type { IGNavItem } from "@/component/common/def/GNav";
import { GModal } from "@/component/common/GModal";
import { BrandText } from "@/component/common/BrandText";
import { AsideWrapper } from "@/component/aside/AsideWrapper";
import { AsideHeader } from "@/component/aside/AsideHeader";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { SidebarFooter } from "./SidebarFooter";
import type { IAsideConfig } from "@/component/aside/AsideTypes";
import type { ISidebarProps } from "./def/Sidebar";

function Sidebar({ aside: asideProp }: ISidebarProps) {
  const router = useRouter();
  const { activeId, t, sidebarNav } = useNavigation();
  const asideDefault = useAside(false);
  const aside = asideProp ?? asideDefault;
  const { collapsed, open, closeMobile, expand, collapse } = aside;
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardData();

  const navItems = useMemo<IGNavItem[]>(
    () =>
      sidebarNav.map(({ id, labelKey, icon: Icon, badge }) => ({
        id,
        icon: <GIcon icon={Icon} size={SizeEnum.md} />,
        label: t[labelKey as keyof typeof t],
        active: activeId === id,
        onClick: () => {
          router.push(`/${id}`);
          closeMobile();
        },
        badge:
          badge === "friends" && friendRequestCount > 0 ? (
            <GBadge size={SizeEnum.sm} className="min-w-5 justify-center">
              {friendRequestCount}
            </GBadge>
          ) : badge === "messages" && unreadMessageCount > 0 ? (
            <GBadge size={SizeEnum.sm} className="min-w-5 justify-center">
              {unreadMessageCount}
            </GBadge>
          ) : badge === "invites" && gameInvites.length + unreadNotificationCount > 0 ? (
            <GBadge size={SizeEnum.sm} className="min-w-5 justify-center">
              {gameInvites.length + unreadNotificationCount}
            </GBadge>
          ) : undefined,
      })),
    [t, activeId, router, closeMobile, friendRequestCount, unreadMessageCount, gameInvites.length, unreadNotificationCount, sidebarNav],
  );

  const asideConfig: IAsideConfig = {
    expandedWidth: "w-72",
    collapsedWidth: "w-18",
    label: t.mainNavigation,
  };

  const brand = (
    <>
      <GIcon icon={Hexagon} size={SizeEnum.sm} tile tileColor={AccentColorEnum.OnPrimary} />
      <BrandText name={t.brand} className="truncate font-bold text-text text-lg" />
    </>
  );

  return (
    <>
      {/* Laptop (xl+): real layout column */}
      <div className="hidden xl:flex">
        <AsideWrapper config={asideConfig} collapsed={collapsed} footer={<SidebarFooter collapsed={collapsed} closeMobile={closeMobile} />}>
          <GNav
            items={navItems}
            orientation={NavOrientationEnum.Vertical}
            indicator={IndicatorPositionEnum.Start}
            collapsed={collapsed}
            className="flex-1 px-3 py-2"
          />
        </AsideWrapper>
      </div>

      {/* Tablet (md–xl): modal overlay from the logical start side */}
      <GModal open={open} onClose={closeMobile} side="start" ariaLabel={t.mainNavigation} className="hidden md:block xl:hidden">
        <AsideHeader
          overlay
          collapsed={collapsed}
          expand={expand}
          collapse={collapse}
          closeMobile={closeMobile}
          label={t.mainNavigation}
          collapsedIcon={<GIcon icon={PanelLeft} size={SizeEnum.md} />}
          brand={brand}
        />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-2">
          <GNav items={navItems} orientation={NavOrientationEnum.Vertical} indicator={IndicatorPositionEnum.Start} className="flex-1" />
        </div>
        <SidebarFooter collapsed={false} closeMobile={closeMobile} />
      </GModal>

      {/* Mobile (<md): no sidebar — bottom navigation instead */}
    </>
  );
}

export { Sidebar };
