"use client";

import { ReactNode, memo } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, Typography } from "@mui/material";
import { AuthUtils } from "./auth";
import { useAuth } from "./auth-context";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: ("USER" | "ADMIN" | "SUPERADMIN")[];
  showLoading?: boolean;
}

// Memoize the RouteGuard component to prevent unnecessary re-renders
const RouteGuard = memo(function RouteGuard({
  children,
  allowedRoles = ["USER", "ADMIN", "SUPERADMIN"],
  showLoading = true,
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading && showLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  // Check if user has required role
  if (!AuthUtils.hasRole(user.role, allowedRoles)) {
    console.log("User does not have required role");
    router.push("/auth/login");
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
});

// Convenience components for role-based access
export const SuperAdminOnly = memo(function SuperAdminOnly({
  children,
  showLoading = true,
}: {
  children: ReactNode;
  showLoading?: boolean;
}) {
  return (
    <RouteGuard allowedRoles={["SUPERADMIN"]} showLoading={showLoading}>
      {children}
    </RouteGuard>
  );
});

export const AdminOnly = memo(function AdminOnly({
  children,
  showLoading = true,
}: {
  children: ReactNode;
  showLoading?: boolean;
}) {
  return (
    <RouteGuard
      allowedRoles={["ADMIN", "SUPERADMIN"]}
      showLoading={showLoading}
    >
      {children}
    </RouteGuard>
  );
});

export const AuthenticatedOnly = memo(function AuthenticatedOnly({
  children,
  showLoading = true,
}: {
  children: ReactNode;
  showLoading?: boolean;
}) {
  return (
    <RouteGuard
      allowedRoles={["USER", "ADMIN", "SUPERADMIN"]}
      showLoading={showLoading}
    >
      {children}
    </RouteGuard>
  );
});

export default RouteGuard;
