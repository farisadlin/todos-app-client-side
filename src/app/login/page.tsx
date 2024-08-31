"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import AuthLayout from "../layouts/AuthLayout";
import Navigation from "@/components/Navigation";

interface LoginResponse {
  token: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      setCookie("token", data.token, { maxAge: 60 * 60 * 24 * 7 }); // Set cookie for 7 days
      router.push("/");
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error("Login failed:", axiosError);
      toast.error(axiosError.response?.data?.error || "Login failed");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <>
      <Navigation />
      <AuthLayout title="Login">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-black"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded flex justify-center items-center"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <Spinner /> : "Login"}
          </button>
        </form>
        <p className="mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
