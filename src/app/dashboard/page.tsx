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
      <Box sx={{ p: 4, width: 1, maxWidth: "none", overflow: "hidden" }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={6}
        >
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
        <Card sx={{ mb: 6, p: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={4}>
              <Avatar
                src={user.image || undefined}
                sx={{ width: 100, height: 100 }}
              >
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Welcome, {user.name || "User"}!
                </Typography>
                <Typography color="text.secondary" gutterBottom variant="h6" mb={2}>
                  {user.email}
                </Typography>
                <Chip
                  label={user.role || "USER"}
                  color={getRoleColor(user.role || "USER")}
                  size="medium"
                  sx={{ fontSize: "1rem", px: 2, py: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 6,
            width: 1,
          }}
        >
          <Box sx={{ flex: "1 1 280px", minWidth: "280px" }}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <PersonIcon
                  sx={{ fontSize: 56, color: "primary.main", mb: 3 }}
                />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Edit Profile
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Update your personal information
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/profile")}
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 280px", minWidth: "280px" }}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <UploadIcon
                  sx={{ fontSize: 56, color: "primary.main", mb: 3 }}
                />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Upload Files
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Upload documents and files
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/upload")}
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Upload
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 280px", minWidth: "280px" }}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <SettingsIcon
                  sx={{ fontSize: 56, color: "primary.main", mb: 3 }}
                />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Settings
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Manage your account settings
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/settings")}
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 280px", minWidth: "280px" }}>
            <Card sx={{ height: "100%", p: 1 }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <LogoutIcon sx={{ fontSize: 56, color: "error.main", mb: 3 }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Logout
                </Typography>
                <Typography color="text.secondary" mb={3} variant="body1">
                  Sign out of your account
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Activity */}
        <Card sx={{ p: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} mb={3}>
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
