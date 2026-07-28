import { useTranslation } from "@/hooks/useSetting";
import { Hexagon, Menu } from "lucide-react";
import { ar } from "./i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { useAside } from "@/hooks/useAside";
import { GIcon } from "./common/GIcon";
import { AsideWrapper } from "@/component/aside/AsideWrapper";
import { AsideHeader } from "@/component/aside/AsideHeader";
import { SidebarCollapsed } from "@/component/Sidebar/SidebarCollapsed";
import { SidebarExpanded } from "@/component/Sidebar/SidebarExpanded";
import { AsidePlacementEnum } from "@/domain/enum/AsidePlacementEnum";
import type { AsideConfig } from "@/component/aside/AsideTypes";

function SidebarBrand() {
  return (
    <>
      <GIcon icon={Hexagon} size="sm" tile tileSize="sm" tileGradient="bg-primary" />
      <span className="font-bold text-text text-lg whitespace-nowrap">
        Game<span className="text-primary">Arena</span>
      </span>
    </>
  );
}

function Sidebar() {
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const aside = useAside(false);

  const collapsedIcon = <GIcon icon={Menu} size="md" tile tileSize="md" />;

  const asideConfig: AsideConfig = {
    placement: AsidePlacementEnum.Start,
    expandedWidth: "w-60",
    collapsedWidth: "w-20",
    label: t.mainNavigation,
    mobileIcon: collapsedIcon,
  };

  return (
    <AsideWrapper
      config={asideConfig}
      aside={aside}
      header={<AsideHeader aside={aside} label={t.mainNavigation} brand={<SidebarBrand />} collapsedIcon={collapsedIcon} />}>
      {aside.collapsed && aside.isDesktop ? (
        <SidebarCollapsed closeMobile={aside.closeMobile} />
      ) : (
        <SidebarExpanded closeMobile={aside.closeMobile} />
      )}
    </AsideWrapper>
  );
}

export { Sidebar };
