"use client";

import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/lib/auth-context";

// Lazy load components
const Navigation = lazy(() => import("./LazyNavigation"));
const PublicHeader = lazy(() => import("./PublicHeader"));

export default function ConditionalHeader() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="64px"
        bgcolor="primary.main"
      >
        <CircularProgress size={24} sx={{ color: "white" }} />
      </Box>
    );
  }

  // Show navigation for authenticated users, public header for others
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="64px"
          bgcolor="primary.main"
        >
          <CircularProgress size={24} sx={{ color: "white" }} />
        </Box>
      }
    >
      {user ? <Navigation user={user} /> : <PublicHeader />}
    </Suspense>
  );
}
