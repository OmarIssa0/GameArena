import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";

interface IUserPreferences {
  locale: LocaleEnum;
  theme: ThemeEnum;
  soundEnabled: boolean;
  showOnlineStatus: boolean;
  showGameActivity: boolean;
  showNotifications: boolean;
  pageSize: number;
}

const DEFAULT_USER_PREFERENCES: IUserPreferences = {
  locale: LocaleEnum.En,
  theme: ThemeEnum.Dark,
  soundEnabled: true,
  showOnlineStatus: true,
  showGameActivity: true,
  showNotifications: true,
  pageSize: 10,
};

export type { IUserPreferences };
export { DEFAULT_USER_PREFERENCES };