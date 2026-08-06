import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { authService } from "@/services/def/AuthService";

export function useLogout() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { stopConnections } = useConnections();

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
    }
    await stopConnections();
    setUser(null);
    router.replace("/login");
  };

  return logout;
}
