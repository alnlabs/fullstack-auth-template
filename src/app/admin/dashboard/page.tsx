"use client";

import { useAuth } from "@/lib/auth-context";
import { Box, Typography } from "@mui/material";
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

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: "none",
          backgroundColor: "yellow",
          border: "2px solid red",
          minHeight: "100px",
        }}
      >
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your system."
        />

        {/* Stats Grid */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <StatCard
              title="Total Users"
              value="1,234"
              icon={<PeopleIcon sx={{ fontSize: 40 }} />}
              color="primary"
              subtitle="+12% from last month"
            />
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <StatCard
              title="Active Sessions"
              value="89"
              icon={<SecurityIcon sx={{ fontSize: 40 }} />}
              color="success"
              subtitle="Currently online"
            />
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <StatCard
              title="System Health"
              value="98%"
              icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
              color="info"
              subtitle="All systems operational"
            />
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <StatCard
              title="Storage Used"
              value="2.4GB"
              icon={<StorageIcon sx={{ fontSize: 40 }} />}
              color="warning"
              subtitle="of 10GB total"
            />
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="Recent Activity"
              value="No recent activity"
              color="secondary"
              subtitle="System is running smoothly"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="System Status"
              value="All Good"
              color="success"
              subtitle="Everything is working properly"
            />
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
