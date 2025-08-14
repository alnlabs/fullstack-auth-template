"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useAuth } from "@/lib/auth-context";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { ToastUtils, ToastMessages } from "@/lib/toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
  });

  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    autoSave: true,
    twoFactorAuth: false,
  });

  if (!user) {
    return null; // RouteGuard will handle the redirect
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      ToastUtils.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      ToastUtils.error("New password must be at least 8 characters long");
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

      const data = await response.json();

      if (response.ok) {
        ToastUtils.success(ToastMessages.auth.passwordChanged);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        ToastUtils.error(data.error || ToastMessages.auth.passwordChangeError);
      }
    } catch (error) {
      ToastUtils.error(ToastMessages.auth.passwordChangeError);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSettingsChange = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/users/settings/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationSettings),
      });

      if (response.ok) {
        ToastUtils.success(ToastMessages.general.saveSuccess);
      } else {
        ToastUtils.error(ToastMessages.general.saveError);
      }
    } catch (error) {
      ToastUtils.error(ToastMessages.general.saveError);
    } finally {
      setLoading(false);
    }
  };

  const handleAppSettingsChange = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/users/settings/app", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appSettings),
      });

      if (response.ok) {
        ToastUtils.success(ToastMessages.general.saveSuccess);
      } else {
        ToastUtils.error(ToastMessages.general.saveError);
      }
    } catch (error) {
      ToastUtils.error(ToastMessages.general.saveError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedOnly>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard")}
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
                  <Typography variant="h6">Security</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Manage your account security settings
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                            >
                              {showCurrentPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handlePasswordChange}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6">Notifications</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Configure your notification preferences
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushNotifications: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Push Notifications"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.marketingEmails}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              marketingEmails: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Marketing Emails"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.securityAlerts}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              securityAlerts: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Security Alerts"
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleNotificationSettingsChange}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* App Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <PaletteIcon color="primary" />
                  <Typography variant="h6">Application Settings</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Customize your application experience
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={appSettings.darkMode}
                          onChange={(e) =>
                            setAppSettings({
                              ...appSettings,
                              darkMode: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Dark Mode"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={appSettings.autoSave}
                          onChange={(e) =>
                            setAppSettings({
                              ...appSettings,
                              autoSave: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Auto Save"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={appSettings.twoFactorAuth}
                          onChange={(e) =>
                            setAppSettings({
                              ...appSettings,
                              twoFactorAuth: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Two-Factor Authentication"
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleAppSettingsChange}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save App Settings"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AuthenticatedOnly>
  );
}
