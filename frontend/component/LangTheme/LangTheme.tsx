"use client";

import { Globe, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en, type TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { ILangThemeProps } from "./def/LangTheme";

function LangTheme({ collapsed, className = "" }: ILangThemeProps) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TLangThemeTranslation;
  const isDark = theme === ThemeEnum.Dark;

  return (
    <div className={clsx("flex items-center justify-center gap-1 flex-1", collapsed ? "flex-col" : "w-full", className)}>
      <GButton
        variant={ButtonVariantEnum.Secondary}
        rounded={SizeEnum.sm}
        className={!collapsed ? "flex-1" : ""}
        title={locale === LocaleEnum.En ? t.switchToArabic : t.switchToEnglish}
        onClick={() => setLocale(locale === LocaleEnum.En ? LocaleEnum.Ar : LocaleEnum.En)}>
        <GIcon icon={Globe} size={SizeEnum.md} />
        {!collapsed && <span>{locale === LocaleEnum.En ? t.arabic : t.english}</span>}
      </GButton>
      <GButton
        variant={ButtonVariantEnum.Secondary}
        className={!collapsed ? "flex-1" : ""}
        rounded={SizeEnum.sm}
        title={isDark ? t.switchToLight : t.switchToDark}
        onClick={() => setTheme(isDark ? ThemeEnum.Light : ThemeEnum.Dark)}>
        <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        {!collapsed && <span>{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
