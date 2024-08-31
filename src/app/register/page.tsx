"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import AuthLayout from "../layouts/AuthLayout";
import Navigation from "@/components/Navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      await axiosInstance.post("/auth/register", credentials);
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.error || "Registration failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(registerMutation.mutateAsync({ username, password }), {
      loading: <Spinner />,
      success: "Registration successful!",
      error: (err) => err.response?.data?.error || "Registration failed",
    });
  };

  return (
    <>
      <Navigation />
      <AuthLayout title="Register">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? <Spinner /> : "Register"}
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
