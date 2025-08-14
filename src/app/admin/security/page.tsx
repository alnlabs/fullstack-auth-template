"use client";

import { useAuth } from "@/lib/auth-context";
import { Grid } from "@mui/material";
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/widgets/StatCard";
import PageHeader from "@/components/widgets/PageHeader";

export default function AdminSecurityPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Security"
        subtitle="Security settings and system monitoring"
      />

      {/* Security Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Security Score"
            value="98%"
            icon={<SecurityIcon sx={{ fontSize: 40 }} />}
            color="success"
            subtitle="Excellent security"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="2FA Enabled"
            value="89%"
            icon={<LockIcon sx={{ fontSize: 40 }} />}
            color="primary"
            subtitle="of users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Failed Logins"
            value="12"
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="warning"
            subtitle="Last 24 hours"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value="156"
            icon={<ShieldIcon sx={{ fontSize: 40 }} />}
            color="info"
            subtitle="Currently active"
          />
        </Grid>
      </Grid>

      {/* Security Status */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Password Policy"
            value="Strong"
            color="success"
            subtitle="Complexity requirements met"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Session Timeout"
            value="30 min"
            color="info"
            subtitle="Auto-logout enabled"
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
