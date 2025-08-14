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
  Grid,
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
      <Box sx={{ p: 3, maxWidth: "100%", overflow: "hidden" }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* User Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                src={user.image || undefined}
                sx={{ width: 80, height: 80 }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" gutterBottom>
                  Welcome, {user.name || "User"}!
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Chip
                  label={user.role || "USER"}
                  color={getRoleColor(user.role || "USER")}
                  size="small"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <PersonIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Edit Profile
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Update your personal information
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/profile")}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <UploadIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Upload Files
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Upload documents and files
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/upload")}
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <SettingsIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Settings
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Manage your account settings
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <LogoutIcon
                  sx={{ fontSize: 48, color: "error.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Logout
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Sign out of your account
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography color="text.secondary">
              No recent activity to display.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </AuthenticatedOnly>
  );
}
