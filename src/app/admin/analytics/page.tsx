"use client";

import { useAuth } from "@/lib/auth-context";
import { Grid } from "@mui/material";
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/widgets/StatCard";
import PageHeader from "@/components/widgets/PageHeader";

export default function AdminAnalyticsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        subtitle="System analytics and performance metrics"
      />

      {/* Key Metrics */}
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
            title="Active Users"
            value="89"
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="Currently online"
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Security Score"
            value="98%"
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Excellent security"
          />
        </Grid>
      </Grid>

      {/* Additional Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Recent Logins"
            value="156"
            color="secondary"
            subtitle="Last 24 hours"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="System Uptime"
            value="99.9%"
            color="success"
            subtitle="Last 30 days"
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
