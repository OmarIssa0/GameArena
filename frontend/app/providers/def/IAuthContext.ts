import type { IUser } from "@/domain/meta/IUser";
import type { TNullable } from "@/domain/type/TCommon";

interface AuthContextType {
  user: TNullable<IUser>;
  loading: boolean;
  refreshUser: () => Promise<TNullable<IUser>>;
  setUser: (user: TNullable<IUser>) => void;
}
export type { AuthContextType };
