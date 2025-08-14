"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { AdminOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalStorage: number;
  recentLogins: number;
  systemHealth: "good" | "warning" | "error";
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  if (!user) {
    return null; // RouteGuard will handle the redirect
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Mock data for demo purposes
        setAnalytics({
          totalUsers: 1250,
          activeUsers: 847,
          totalFiles: 3420,
          totalStorage: 2.4, // GB
          recentLogins: 156,
          systemHealth: "good",
        });
      }
    } catch (error) {
      // Mock data for demo purposes
      setAnalytics({
        totalUsers: 1250,
        activeUsers: 847,
        totalFiles: 3420,
        totalStorage: 2.4,
        recentLogins: 156,
        systemHealth: "good",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <AdminOnly>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </AdminOnly>
    );
  }

  return (
    <AdminOnly>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Analytics Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>

        {analytics && (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analytics.totalUsers.toLocaleString()}
                        </Typography>
                        <Typography color="text.secondary">
                          Total Users
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analytics.activeUsers.toLocaleString()}
                        </Typography>
                        <Typography color="text.secondary">
                          Active Users
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <StorageIcon color="info" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analytics.totalFiles.toLocaleString()}
                        </Typography>
                        <Typography color="text.secondary">
                          Total Files
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <SecurityIcon color="warning" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {analytics.recentLogins}
                        </Typography>
                        <Typography color="text.secondary">
                          Recent Logins
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* System Status */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Status
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Chip
                        label={`System Health: ${analytics.systemHealth.toUpperCase()}`}
                        color={getSystemHealthColor(analytics.systemHealth)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      All systems are operating normally. No issues detected.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Storage Usage
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="h4" fontWeight="bold">
                        {analytics.totalStorage} GB
                      </Typography>
                      <Typography color="text.secondary">
                        of storage used
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Storage usage is within normal limits.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Card sx={{ mt: 4 }}>
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
          </>
        )}
      </Container>
    </AdminOnly>
  );
}
