"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function ClearSessionPage() {
  const router = useRouter();

  useEffect(() => {
    const clearAllSessions = async () => {
      console.log("Clearing all sessions...");

      // Clear localStorage
      localStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Clear NextAuth specific items
      localStorage.removeItem("next-auth.session-token");
      localStorage.removeItem("next-auth.csrf-token");
      localStorage.removeItem("next-auth.callback-url");
      localStorage.removeItem("__next-auth.session-token");
      localStorage.removeItem("__next-auth.csrf-token");

      // Sign out from NextAuth
      await signOut({ redirect: false });

      console.log("All sessions cleared, redirecting to home...");

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1000);
    };

    clearAllSessions();
  }, [router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="h6">Clearing all sessions...</Typography>
      <Typography variant="body2" color="text.secondary">
        You will be redirected to the home page shortly.
      </Typography>
    </Box>
  );
}
