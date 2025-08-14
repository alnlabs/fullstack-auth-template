"use client";

import { useState } from "react";
import { AdminOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import TabContent from "@/components/widgets/TabContent";
import { spacing } from "@/lib/spacing";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    systemAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    
    // Appearance Settings
    theme: "light",
    language: "en",
    timezone: "UTC",
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return null;
  }

  const rightControls = (
    <Button 
      variant="contained" 
      onClick={handleSave}
      disabled={saved}
    >
      {saved ? "Saved!" : "Save Settings"}
    </Button>
  );

  return (
    <AdminLayout>
      <TabContent
        title="Admin Settings"
        subtitle="Configure system settings and preferences"
        rightControls={rightControls}
      >
        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Box sx={{ display: "grid", gap: 3 }}>
          {/* Notification Settings */}
          <Card sx={spacing.card}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={600}>
                  Notification Settings
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.systemAlerts}
                      onChange={(e) => handleSettingChange("systemAlerts", e.target.checked)}
                    />
                  }
                  label="System Alerts"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={spacing.card}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <SecurityIcon sx={{ mr: 1, color: "error.main" }} />
                <Typography variant="h6" fontWeight={600}>
                  Security Settings
                </Typography>
              </Box>
              
              <Box sx={{ display: "grid", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                    />
                  }
                  label="Two-Factor Authentication"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Session Timeout (minutes)</InputLabel>
                  <Select
                    value={settings.sessionTimeout}
                    label="Session Timeout (minutes)"
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Password Policy</InputLabel>
                  <Select
                    value={settings.passwordPolicy}
                    label="Password Policy"
                    onChange={(e) => handleSettingChange("passwordPolicy", e.target.value)}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="strong">Strong</MenuItem>
                    <MenuItem value="veryStrong">Very Strong</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card sx={spacing.card}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <StorageIcon sx={{ mr: 1, color: "info.main" }} />
                <Typography variant="h6" fontWeight={600}>
                  System Settings
                </Typography>
              </Box>
              
              <Box sx={{ display: "grid", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange("maintenanceMode", e.target.checked)}
                    />
                  }
                  label="Maintenance Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.debugMode}
                      onChange={(e) => handleSettingChange("debugMode", e.target.checked)}
                    />
                  }
                  label="Debug Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
                    />
                  }
                  label="Automatic Backup"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card sx={spacing.card}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PaletteIcon sx={{ mr: 1, color: "secondary.main" }} />
                <Typography variant="h6" fontWeight={600}>
                  Appearance Settings
                </Typography>
              </Box>
              
              <Box sx={{ display: "grid", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    label="Theme"
                    onChange={(e) => handleSettingChange("theme", e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) => handleSettingChange("language", e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) => handleSettingChange("timezone", e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">Eastern Time</MenuItem>
                    <MenuItem value="PST">Pacific Time</MenuItem>
                    <MenuItem value="GMT">GMT</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabContent>
    </AdminLayout>
  );
}
