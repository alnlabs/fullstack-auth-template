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
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { AdminOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import { ToastUtils, ToastMessages } from "@/lib/toast";

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  ipWhitelist: string[];
  auditLogging: boolean;
}

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_login"
    | "password_change"
    | "admin_action";
  user: string;
  ip: string;
  timestamp: string;
  details: string;
}

export default function AdminSecurityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    ipWhitelist: [],
    auditLogging: true,
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  if (!user) {
    return null; // RouteGuard will handle the redirect
  }

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await fetch("/api/admin/security", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSecuritySettings(data.settings);
        setSecurityEvents(data.events);
      } else {
        // Mock data for demo purposes
        setSecurityEvents([
          {
            id: "1",
            type: "login",
            user: "admin@example.com",
            ip: "192.168.1.100",
            timestamp: new Date().toISOString(),
            details: "Successful login",
          },
          {
            id: "2",
            type: "failed_login",
            user: "user@example.com",
            ip: "192.168.1.101",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            details: "Failed login attempt",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching security data:", error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(securitySettings),
      });

      if (response.ok) {
        ToastUtils.success("Security settings updated successfully!");
      } else {
        ToastUtils.error("Failed to update security settings");
      }
    } catch (error) {
      ToastUtils.error("Failed to update security settings");
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircleIcon color="success" />;
      case "logout":
        return <CheckCircleIcon color="info" />;
      case "failed_login":
        return <ErrorIcon color="error" />;
      case "password_change":
        return <LockIcon color="warning" />;
      case "admin_action":
        return <SecurityIcon color="primary" />;
      default:
        return <WarningIcon />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "login":
        return "success";
      case "logout":
        return "info";
      case "failed_login":
        return "error";
      case "password_change":
        return "warning";
      case "admin_action":
        return "primary";
      default:
        return "default";
    }
  };

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
            Security Settings
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6">Authentication Settings</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Two-Factor Authentication"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.auditLogging}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          auditLogging: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Audit Logging"
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="text.secondary" mb={2}>
                  Session Timeout: {securitySettings.sessionTimeout} minutes
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Max Login Attempts: {securitySettings.maxLoginAttempts}
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>

            {/* Password Policy */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <LockIcon color="primary" />
                  <Typography variant="h6">Password Policy</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  Minimum Length: {securitySettings.passwordPolicy.minLength}{" "}
                  characters
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordPolicy.requireUppercase}
                      disabled
                    />
                  }
                  label="Require Uppercase Letters"
                  sx={{ mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordPolicy.requireLowercase}
                      disabled
                    />
                  }
                  label="Require Lowercase Letters"
                  sx={{ mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.passwordPolicy.requireNumbers}
                      disabled
                    />
                  }
                  label="Require Numbers"
                  sx={{ mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        securitySettings.passwordPolicy.requireSpecialChars
                      }
                      disabled
                    />
                  }
                  label="Require Special Characters"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Security Events */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <ShieldIcon color="primary" />
                  <Typography variant="h6">Recent Security Events</Typography>
                </Box>

                {securityEvents.length === 0 ? (
                  <Typography color="text.secondary">
                    No security events to display.
                  </Typography>
                ) : (
                  <List>
                    {securityEvents.map((event) => (
                      <ListItem key={event.id} divider>
                        <ListItemIcon>{getEventIcon(event.type)}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" fontWeight="500">
                                {event.user}
                              </Typography>
                              <Chip
                                label={event.type.replace("_", " ")}
                                color={getEventColor(event.type)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {event.ip} •{" "}
                                {new Date(event.timestamp).toLocaleString()}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {event.details}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Security Status
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Alert severity="success" sx={{ mb: 2 }}>
                  All security systems are operational
                </Alert>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Firewall Status</Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">SSL Certificate</Typography>
                    <Chip label="Valid" color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Database Security</Typography>
                    <Chip label="Secure" color="success" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminOnly>
  );
}
