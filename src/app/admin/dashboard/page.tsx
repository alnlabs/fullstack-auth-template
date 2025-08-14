"use client";

import { useAuth } from "@/lib/auth-context";
import { Grid, Typography, Box } from "@mui/material";
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/widgets/StatCard";
import PageHeader from "@/components/widgets/PageHeader";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  console.log("Dashboard: user =", user);

  if (!user) {
    console.log("Dashboard: No user, returning null");
    return null;
  }

  return (
    <AdminLayout>
      <Box sx={{ backgroundColor: "red", p: 2, mb: 2 }}>
        <Typography variant="h1" color="white">
          DASHBOARD IS LOADING!
        </Typography>
      </Box>
      
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your system."
      />

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value="1,234"
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value="89"
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="Currently online"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value="98%"
            icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="All systems operational"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Storage Used"
            value="2.4GB"
            icon={<StorageIcon sx={{ fontSize: 40 }} />}
            color="warning"
            subtitle="of 10GB total"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Recent Activity"
            value="No recent activity"
            color="secondary"
            subtitle="System is running smoothly"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="System Status"
            value="All Good"
            color="success"
            subtitle="Everything is working properly"
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
