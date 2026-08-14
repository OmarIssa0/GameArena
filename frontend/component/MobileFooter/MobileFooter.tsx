"use client";

import { useRouter } from "next/navigation";
import { GNav } from "@/component/common/GNav";
import { useNavigation } from "@/hooks/useNavigation";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { iconSize } from "@/domain/constant/size-classes";

function MobileFooter() {
  const router = useRouter();
  const { activeId, t, sidebarNav } = useNavigation();

  const mobileNavItems = sidebarNav.filter((n) => n.mobile !== false);

  const navItems = mobileNavItems.map(({ id, labelKey, icon: Icon }) => ({
    id,
    icon: <Icon className={iconSize[SizeEnum.sm]} />,
    size: SizeEnum.sm,
    label: t[labelKey as keyof typeof t],
    active: activeId === id,
    onClick: () => router.push(`/${id}`),
  }));

  return (
    <GNav
      className="md:hidden bg-bg-sidebar border-t pb-safe"
      aria-label={t.mainNavigation}
      items={navItems}
      orientation={NavOrientationEnum.Horizontal}
      indicator={IndicatorPositionEnum.Top}
      stacked
    />
  );
}

export { MobileFooter };
