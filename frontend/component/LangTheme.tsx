"use client";

import { Globe, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en, type TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";
import { GIcon } from "./common/GIcon";
import { GButton } from "./common/GButton";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

function LangTheme({ collapsed, className = "" }: { collapsed: boolean; className?: string }) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TLangThemeTranslation;

  const isDark = theme === "dark";

  const toggleLocale = () => {
    const next = locale === LocaleEnum.En ? LocaleEnum.Ar : LocaleEnum.En;
    setLocale(next);
  };

  const toggleTheme = () => {
    const next = isDark ? ThemeEnum.Light : ThemeEnum.Dark;
    setTheme(next);
  };

  return (
    <div className={clsx("flex items-center justify-center gap-1 flex-1", collapsed ? "flex-col" : "w-full", className)}>
      <GButton
        variant={ButtonVariantEnum.Secondary}
        rounded={SizeEnum.sm}
        className={!collapsed ? "flex-1" : ""}
        title={locale === "en" ? t.switchToArabic : t.switchToEnglish}
        onClick={toggleLocale}>
        <GIcon icon={Globe} size={SizeEnum.md} />
        {!collapsed && <span>{locale === "en" ? t.arabic : t.english}</span>}
      </GButton>

      <GButton
        variant={ButtonVariantEnum.Secondary}
        className={!collapsed ? "flex-1" : ""}
        rounded={SizeEnum.sm}
        title={isDark ? t.switchToLight : t.switchToDark}
        onClick={toggleTheme}>
        <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        {!collapsed && <span>{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
