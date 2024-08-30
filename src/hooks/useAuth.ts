import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";

export const useAuth = () => {
  const router = useRouter();
  const token = getCookie("token");

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  return { token, handleLogout };
};
