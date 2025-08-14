"use client";

import Navigation from "./Navigation";
import PublicHeader from "./PublicHeader";
import { useAuth } from "@/lib/auth-context";

export default function ConditionalHeader() {
  const { user, loading } = useAuth();

  // Simple loading state
  if (loading) {
    return null;
  }

  // Show navigation for authenticated users, public header for others
  return user ? <Navigation user={user} /> : <PublicHeader />;
}
