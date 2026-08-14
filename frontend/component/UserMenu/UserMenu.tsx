"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, Globe, LogOut, ChevronDown, Moon, Sun } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GDropdown } from "@/component/common/GDropdown";
import { GDropdownItem } from "@/component/common/GDropdownItem";
import { GUserInfo } from "@/component/common/GUserInfo";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { ar } from "@/component/i18n/UserMenu/ar.i18n";
import { en, type TUserMenuTranslation } from "@/component/i18n/UserMenu/en.i18n";

function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TUserMenuTranslation;

  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    setOpen(false);
    setTheme(theme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark);
  };
  const toggleLocale = () => {
    setOpen(false);
    setLocale(locale === LocaleEnum.En ? LocaleEnum.Ar : LocaleEnum.En);
  };
  const handleLogout = () => {
    setOpen(false);
    logout();
  };
  const handleProfile = () => {
    setOpen(false);
    router.push("/settings");
  };
console.log("user", user);
  return (
    <GDropdown
      open={open}
      onClose={() => setOpen(false)}
      align="end"
      trigger={
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.md}
          rounded={SizeEnum.full}
          aria-label={t.userMenu}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((o) => !o)}>
          <div className="flex items-center gap-2">
            <GAvatar firstName={user?.firstName} lastName={user?.lastName} status={user?.status} size={SizeEnum.xs} />
            <span className="hidden sm:inline-block truncate max-w-32 text-sm font-medium text-text">
              {user?.firstName} {user?.lastName}
            </span>
            <GIcon icon={ChevronDown} size={SizeEnum.xs} className="text-text-muted shrink-0" />
          </div>
        </GButton>
      }>
      <div className="p-2 border-b border-border">
        <GUserInfo firstName={user?.firstName} lastName={user?.lastName} userName={user?.userName} status={user?.status} avatarSize={SizeEnum.xs} />
      </div>

      <GDropdownItem icon={User} label={t.profile} onClick={handleProfile} />
      <GDropdownItem icon={theme === ThemeEnum.Dark ? Sun : Moon} label={theme === ThemeEnum.Dark ? t.light : t.dark} onClick={toggleTheme} />
      <GDropdownItem icon={Globe} label={locale === LocaleEnum.En ? t.arabic : t.english} onClick={toggleLocale} />
      <GDropdownItem icon={Settings} label={t.settings} onClick={() => router.push("/settings")} />
      <GDropdownItem icon={LogOut} label={t.logout} className="text-danger!" onClick={handleLogout} />
    </GDropdown>
  );
}

export { UserMenu };
