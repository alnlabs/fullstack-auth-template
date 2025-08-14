"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, Typography } from "@mui/material";
import { AuthUtils } from "./auth";
import { useAuth } from "./auth-context";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: ("USER" | "ADMIN" | "SUPERADMIN")[];
  showLoading?: boolean;
}

export default function RouteGuard({
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
}

// Convenience components for specific roles
export function SuperAdminOnly({
  children,
  ...props
}: Omit<RouteGuardProps, "allowedRoles">) {
  return (
    <RouteGuard allowedRoles={["SUPERADMIN"]} {...props}>
      {children}
    </RouteGuard>
  );
}

export function AdminOnly({
  children,
  ...props
}: Omit<RouteGuardProps, "allowedRoles">) {
  return (
    <RouteGuard allowedRoles={["ADMIN", "SUPERADMIN"]} {...props}>
      {children}
    </RouteGuard>
  );
}

export function UserOnly({
  children,
  ...props
}: Omit<RouteGuardProps, "allowedRoles">) {
  return (
    <RouteGuard allowedRoles={["USER"]} {...props}>
      {children}
    </RouteGuard>
  );
}

export function AuthenticatedOnly({
  children,
  ...props
}: Omit<RouteGuardProps, "allowedRoles">) {
  return (
    <RouteGuard allowedRoles={["USER", "ADMIN", "SUPERADMIN"]} {...props}>
      {children}
    </RouteGuard>
  );
}
