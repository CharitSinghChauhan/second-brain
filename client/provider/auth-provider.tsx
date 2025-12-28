"use client";

import { useEffect } from "react";
import { api } from "@/axios/axios";
import { useAuthStore } from "@/store/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AuthProvider = () => {
  const { setUser, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = (await api.get("/auth/me")).data;

        if (response.success) {
          setUser({
            email: response.payload.email,
            username: response.payload.username,
          });
        } else {
          logout();
          router.push("/sign-in");
          toast.error("Authentication failed");
        }
      } catch (error) {
        logout();
        router.push("/sign-in");
        toast.error("logout");
      }
    };
    fetchAuth();
  }, [setUser, logout]);

  return null;
};
export default AuthProvider;
