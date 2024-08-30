"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react"; // Add this import

interface NavigationProps {
  isLoggedIn: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  isLoggedIn: initialIsLoggedIn,
}) => {
  const { handleLogout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialIsLoggedIn]);

  const handleClickLogout = () => {
    toast.success("Logout successful");
    handleLogout();
  };

  return (
    <nav className="mb-8 px-12 py-4 flex justify-end">
      <Toaster />
      {isLoggedIn && (
        <Link
          href="/logout"
          onClick={handleClickLogout}
          className="text-blue-500"
        >
          Logout
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
