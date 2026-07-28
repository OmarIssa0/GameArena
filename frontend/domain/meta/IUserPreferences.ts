interface IUserPreferences {
  locale: "en" | "ar";
  theme: "light" | "dark";
  soundEnabled: boolean;
  showOnlineStatus: boolean;
  showGameActivity: boolean;
  showNotifications: boolean;
  pageSize: number;
}

const DEFAULT_USER_PREFERENCES: IUserPreferences = {
  locale: "en",
  theme: "dark",
  soundEnabled: true,
  showOnlineStatus: true,
  showGameActivity: true,
  showNotifications: true,
  pageSize: 10,
};

export type { IUserPreferences };
export { DEFAULT_USER_PREFERENCES };
