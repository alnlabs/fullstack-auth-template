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
  Avatar,
  Divider,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { spacing } from "@/lib/spacing";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await refreshUser();
        // Toast notifications are handled by the auth context
      }
    } catch (error) {
      // Error handling is done by the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await refreshUser();
        // Toast notifications are handled by the auth context
      }
    } catch (error) {
      // Error handling is done by the auth context
    }
  };

  return (
    <AuthenticatedOnly>
      <Box sx={spacing.pageContainer}>
        {/* Header */}
        <Box sx={spacing.header}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Profile
          </Typography>
        </Box>

        {/* Profile Form */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Typography variant="h4" sx={spacing.title}>
              Personal Information
            </Typography>
            
            <Box sx={spacing.userInfo} mb={4}>
              <Avatar src={user.image || undefined} sx={spacing.avatar}>
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Profile Picture
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <Button variant="outlined" component="span">
                    Upload New Picture
                  </Button>
                </label>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                {...spacing.button}
                sx={{ alignSelf: "flex-start" }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AuthenticatedOnly>
  );
}
