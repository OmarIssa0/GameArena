"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { userApi } from "@/lib/user.api";
import { getLocale } from "@/Hooks/useTranslation";

type User = {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: number;
  createdAt: string;
  isVerified: boolean;
};

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  language: string;
}>({
  user: null,
  loading: true,
  language: "en",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const language = getLocale();
  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await userApi.profile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/register";
    if (isAuthPage) {
      setUser(null);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    loadUser();
    return () => {
      user && setUser(null);
    };
  }, [pathname, user]);

  return (
    <AuthContext.Provider value={{ user, loading, language }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
