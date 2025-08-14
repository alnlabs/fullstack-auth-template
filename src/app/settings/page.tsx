"use client";

import { useState } from "react";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";
import { spacing } from "@/lib/spacing";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  if (!user) {
    return null;
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Toast notifications are handled by the auth context
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Toast notifications are handled by the auth context
      }
    } catch (error) {
      // Error handling is done by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedOnly>
      <Box sx={spacing.pageContainer}>
        {/* Header */}
        <Box sx={spacing.header}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Settings
          </Typography>
        </Box>

        {/* Password Change Section */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Typography variant="h4" sx={spacing.title}>
              Change Password
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={loading}
                {...spacing.button}
                sx={{ alignSelf: "flex-start" }}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Typography variant="h4" sx={spacing.title}>
              Notification Settings
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        push: e.target.checked,
                      })
                    }
                  />
                }
                label="Push Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        sms: e.target.checked,
                      })
                    }
                  />
                }
                label="SMS Notifications"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card sx={spacing.card}>
          <CardContent>
            <Typography variant="h4" sx={spacing.title}>
              Application Settings
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Additional application settings will be available soon.
            </Alert>
            
            <Typography color="text.secondary" variant="body1">
              More customization options are coming in future updates.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </AuthenticatedOnly>
  );
}
