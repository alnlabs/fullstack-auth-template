"use client";

import { useRouter } from "next/navigation";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { spacing } from "@/lib/spacing";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    // Toast notifications are handled by the auth context
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "error";
      case "ADMIN":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <AuthenticatedOnly>
      <Box sx={spacing.pageContainer}>
        {/* Header */}
        <Box sx={spacing.header}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => router.push("/profile")}
              size="large"
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="large"
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* User Info Card */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Box sx={spacing.userInfo}>
              <Avatar
                src={user.image || undefined}
                sx={spacing.avatar}
              >
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Welcome, {user.name || "User"}!
                </Typography>
                <Typography
                  color="text.secondary"
                  gutterBottom
                  variant="h6"
                  mb={2}
                >
                  {user.email}
                </Typography>
                <Chip
                  label={user.role || "USER"}
                  color={getRoleColor(user.role || "USER")}
                  size="medium"
                  sx={spacing.chip}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Box sx={spacing.cardGrid}>
          <Box sx={spacing.cardItem}>
            <Card sx={spacing.card}>
              <CardContent sx={spacing.cardContent}>
                <PersonIcon
                  sx={{ ...spacing.icon, color: "primary.main" }}
                />
                <Typography variant="h5" sx={spacing.title}>
                  Edit Profile
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Update your personal information
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/profile")}
                  {...spacing.button}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={spacing.cardItem}>
            <Card sx={spacing.card}>
              <CardContent sx={spacing.cardContent}>
                <UploadIcon
                  sx={{ ...spacing.icon, color: "primary.main" }}
                />
                <Typography variant="h5" sx={spacing.title}>
                  Upload Files
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Upload documents and files
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/upload")}
                  {...spacing.button}
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={spacing.cardItem}>
            <Card sx={spacing.card}>
              <CardContent sx={spacing.cardContent}>
                <SettingsIcon
                  sx={{ ...spacing.icon, color: "primary.main" }}
                />
                <Typography variant="h5" sx={spacing.title}>
                  Settings
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Manage your account settings
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/settings")}
                  {...spacing.button}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={spacing.cardItem}>
            <Card sx={spacing.card}>
              <CardContent sx={spacing.cardContent}>
                <LogoutIcon sx={{ ...spacing.icon, color: "error.main" }} />
                <Typography variant="h5" sx={spacing.title}>
                  Logout
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Sign out of your account
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  {...spacing.button}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Activity */}
        <Card sx={spacing.card}>
          <CardContent>
            <Typography variant="h5" sx={spacing.title}>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography color="text.secondary" variant="body1">
              No recent activity to display.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </AuthenticatedOnly>
  );
}
