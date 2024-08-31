"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react"; // Add this import
import Header from "./Header";

const Navigation = () => {
  const { token, handleLogout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(token));
  }, [token]);

  const handleClickLogout = async () => {
    await handleLogout();
    setIsLoggedIn(false);
    toast.success("Logout successful");
  };

  return (
    <nav className="bg-blue-500">
      <div
        className={`mb-8 md:px-12 px-4 py-4 flex ${
          isLoggedIn ? "justify-between" : "justify-center"
        } items-center bg-blue-500 max-w-[1440px] mx-auto`}
      >
        <Header title="TODOS APP WITH NODE.JS" />
        <Toaster />
        {isLoggedIn ? (
          <Link
            href="/logout"
            onClick={handleClickLogout}
            className="text-blue-500 bg-white px-4 py-2 rounded-md hover:opacity-80 hover:transition-opacity font-medium"
            as={"button"}
            type="button"
          >
            Logout
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navigation;
