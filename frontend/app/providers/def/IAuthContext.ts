import type { IUser } from "@/domain/meta/IUser";
import { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { TNullable } from "@/domain/type/TCommon";

interface AuthContextType {
  user: TNullable<IUser>;
  loading: boolean;
  updatePreferences: (newPreferences: Partial<IUserPreferences>) => void;
  refreshUser: () => Promise<TNullable<IUser>>;
  setUser: (user: TNullable<IUser>) => void;
}
export type { AuthContextType };
