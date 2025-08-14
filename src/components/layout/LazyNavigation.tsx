"use client";

import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { User } from "@/lib/auth";

// Lazy load the Navigation component
const Navigation = lazy(() => import("./Navigation"));

interface LazyNavigationProps {
  user: User;
}

export default function LazyNavigation({ user }: LazyNavigationProps) {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="64px"
        >
          <CircularProgress size={24} />
        </Box>
      }
    >
      <Navigation user={user} />
    </Suspense>
  );
}
