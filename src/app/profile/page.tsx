"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "@/lib/auth-context";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { ToastUtils, ToastMessages } from "@/lib/toast";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    location: "",
    company: "",
    jobTitle: "",
  });

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        company: user.company || "",
        jobTitle: user.jobTitle || "",
      });
    }
  }, [user]);

  if (!user) {
    return null; // RouteGuard will handle the redirect
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

      const data = await response.json();

      if (!response.ok) {
        ToastUtils.error(data.error || ToastMessages.profile.updateError);
      } else {
        ToastUtils.success(ToastMessages.profile.updateSuccess);
        setIsEditing(false);
        // Refresh user data
        await refreshUser();
      }
    } catch (error) {
      ToastUtils.error(ToastMessages.profile.updateError);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      ToastUtils.error("File size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      ToastUtils.error("Please select an image file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        ToastUtils.error(data.error || ToastMessages.profile.avatarUploadError);
      } else {
        ToastUtils.success(ToastMessages.profile.avatarUploadSuccess);
        // Refresh user data
        await refreshUser();
      }
    } catch (error) {
      ToastUtils.error(ToastMessages.profile.avatarUploadError);
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
            Profile
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Avatar Section */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={user.image || undefined}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {user.name?.charAt(0) || "U"}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                />

                <Typography variant="h6" gutterBottom>
                  {user.name || "User"}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {user.role || "USER"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">Personal Information</Typography>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    startIcon={isEditing ? undefined : <EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={loading}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      disabled={!isEditing || loading}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AuthenticatedOnly>
  );
}
