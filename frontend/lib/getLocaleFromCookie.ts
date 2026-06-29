import { cookies } from "next/headers";
import type { TLocale, TTheme } from "@/types";

export async function getSettingFromCookie(): Promise<{
  locale: TLocale;
  theme: TTheme;
}> {
  const cookieStore = await cookies();

  const locale = cookieStore.get("locale")?.value;
  const theme = cookieStore.get("theme")?.value;

  return {
    locale: locale === "ar" ? "ar" : "en",
    theme: theme === "light" ? "light" : "dark",
  };
}
