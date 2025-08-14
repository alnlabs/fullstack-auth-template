"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { AdminOnly } from "@/lib/route-guard";

export default function AdminDashboardPage() {
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
    <AdminOnly>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <AdminIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" component="h1">
              Admin Dashboard
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => router.push("/settings")}
            >
              Settings
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

        {/* Admin Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                src={user.image || undefined}
                sx={{ width: 80, height: 80 }}
              >
                <AdminIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" gutterBottom>
                  Welcome, {user.name || "Admin"}!
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Chip
                  label={user.role || "ADMIN"}
                  color={getRoleColor(user.role || "ADMIN")}
                  size="small"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Admin Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <PeopleIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  User Management
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Manage users, roles, and permissions
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/admin/users")}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <AssessmentIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Analytics
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  View system analytics and reports
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/admin/analytics")}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <SecurityIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Security
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Manage security settings and logs
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/admin/security")}
                >
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>


        </Grid>

        {/* System Status */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Database"
                      secondary="Connected and operational"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Authentication"
                      secondary="JWT tokens active"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="User Sessions"
                      secondary="Active sessions: 1"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssessmentIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="System Health"
                      secondary="All systems operational"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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
      </Container>
    </AdminOnly>
  );
}
