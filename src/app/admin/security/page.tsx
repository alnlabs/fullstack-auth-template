"use client";

import { useAuth } from "@/lib/auth-context";
import { Box } from "@mui/material";
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import TabContent from "@/components/widgets/TabContent";
import StatCard from "@/components/widgets/StatCard";
import { spacing } from "@/lib/spacing";

export default function AdminSecurityPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <TabContent
        title="Security"
        subtitle="Security settings and system monitoring"
      >
        {/* Security Metrics */}
        <Box sx={spacing.cardGrid}>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Security Score"
              value="98%"
              icon={<SecurityIcon sx={{ fontSize: 40 }} />}
              color="success"
              subtitle="Excellent security"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="2FA Enabled"
              value="89%"
              icon={<LockIcon sx={{ fontSize: 40 }} />}
              color="primary"
              subtitle="of users"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Failed Logins"
              value="12"
              icon={<WarningIcon sx={{ fontSize: 40 }} />}
              color="warning"
              subtitle="Last 24 hours"
            />
          </Box>
          <Box sx={spacing.cardItem}>
            <StatCard
              title="Active Sessions"
              value="156"
              icon={<ShieldIcon sx={{ fontSize: 40 }} />}
              color="info"
              subtitle="Currently active"
            />
          </Box>
        </Box>

        {/* Security Status */}
        <Box sx={spacing.cardGrid}>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="Password Policy"
              value="Strong"
              color="success"
              subtitle="Complexity requirements met"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <StatCard
              title="Session Timeout"
              value="30 min"
              color="info"
              subtitle="Auto-logout enabled"
            />
          </Box>
        </Box>
      </TabContent>
    </AdminLayout>
  );
}
