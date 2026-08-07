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

function LangTheme({ collapsed, className = "" }: { collapsed: boolean; className?: string }) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TLangThemeTranslation;

  const isDark = theme === "dark";
  const sizeClass = collapsed ? "h-10 w-10 min-w-10" : "flex-1 w-full";

  const toggleBtn = clsx(
    "flex items-center justify-center gap-2 text-xs font-semibold border border-border text-text-secondary bg-surface",
    "rounded-[var(--radius-sm)] transition-colors duration-150",
    "hover:text-primary hover:border-primary/40",
    sizeClass,
  );

  const toggleLocale = () => {
    const next = locale === LocaleEnum.En ? LocaleEnum.Ar : LocaleEnum.En;
    setLocale(next);
  };

  const toggleTheme = () => {
    const next = isDark ? ThemeEnum.Light : ThemeEnum.Dark;
    setTheme(next);
  };

  return (
    <div className={clsx(" flex items-center justify-center gap-2", collapsed ? "flex-col" : "w-full", className)}>
      <GButton
        variant={AccentColorEnum.Muted}
        onClick={toggleLocale}
        title={locale === "en" ? t.switchToArabic : t.switchToEnglish}
        className={toggleBtn}>
        <GIcon icon={Globe} size={SizeEnum.md} />
        {!collapsed && <span>{locale === "en" ? t.english : t.arabic}</span>}
      </GButton>

      <GButton
        variant={AccentColorEnum.Muted}
        onClick={toggleTheme}
        title={isDark ? t.switchToLight : t.switchToDark}
        className={toggleBtn}>
        <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        {!collapsed && <span>{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
