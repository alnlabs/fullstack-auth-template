"use client";

import { useAuth } from "@/lib/auth-context";
import { Box } from "@mui/material";
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import TabContent from "@/components/widgets/TabContent";
import StatCard from "@/components/widgets/StatCard";
import { spacing } from "@/lib/spacing";

export default function AdminAnalyticsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <TabContent
        title="Analytics"
        subtitle="System analytics and performance metrics"
      >
        {/* Key Metrics */}
        <Box sx={spacing.cardGrid}>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Total Users"
              value="1,234"
              icon={<PeopleIcon sx={{ fontSize: 40 }} />}
              color="primary"
              subtitle="+12% from last month"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Active Users"
              value="89"
              icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
              color="success"
              subtitle="Currently online"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Storage Used"
              value="2.4GB"
              icon={<StorageIcon sx={{ fontSize: 40 }} />}
              color="warning"
              subtitle="of 10GB total"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Security Score"
              value="98%"
              icon={<SecurityIcon sx={{ fontSize: 40 }} />}
              color="info"
              subtitle="Excellent security"
            />
          </Box>
        </Box>

        {/* Additional Analytics */}
        <Box sx={spacing.cardGrid}>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="Recent Logins"
              value="156"
              color="secondary"
              subtitle="Last 24 hours"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="System Uptime"
              value="99.9%"
              color="success"
              subtitle="Last 30 days"
            />
          </Box>
        </Box>
      </TabContent>
    </AdminLayout>
  );
}
