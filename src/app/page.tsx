"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const features = [
    {
      title: "Authentication",
      description:
        "Secure login with email/password and role-based access control",
      icon: "🔐",
    },
    {
      title: "User Management",
      description: "Comprehensive user profiles and admin management",
      icon: "👥",
    },
    {
      title: "File Upload",
      description: "Secure document and image upload with validation",
      icon: "📁",
    },
    {
      title: "Real-time Notifications",
      description: "Toast notifications for better user experience",
      icon: "🔔",
    },
    {
      title: "Responsive Design",
      description: "Modern UI that works on all devices",
      icon: "📱",
    },
    {
      title: "Performance Optimized",
      description: "Fast loading with lazy loading and code splitting",
      icon: "⚡",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "error";
      case "ADMIN":
        return "warning";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Welcome to MyMentor
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          A comprehensive interview platform with advanced authentication and
          user management
        </Typography>

        {user ? (
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={3}
            >
              <Avatar
                src={user.image || undefined}
                sx={{ width: 64, height: 64 }}
              >
                {user.name?.charAt(0)}
              </Avatar>
              <Box textAlign="left">
                <Typography variant="h6">
                  Welcome back, {user.name || "User"}!
                </Typography>
                <Chip
                  label={user.role}
                  color={getRoleColor(user.role)}
                  size="small"
                />
              </Box>
            </Box>
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={
                  user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                    <AdminIcon />
                  ) : (
                    <DashboardIcon />
                  )
                }
                onClick={() =>
                  router.push(
                    user.role === "ADMIN" || user.role === "SUPERADMIN"
                      ? "/admin/dashboard"
                      : "/dashboard"
                  )
                }
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push("/profile")}
              >
                View Profile
              </Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RegisterIcon />}
              onClick={() => router.push("/auth/register")}
            >
              Create Account
            </Button>
          </Box>
        )}
      </Box>

      {/* Features Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 4,
          mb: 8,
        }}
      >
        {features.map((feature, index) => (
          <Card key={index} sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Typography variant="h1" sx={{ fontSize: "3rem", mb: 2 }}>
                {feature.icon}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tech Stack */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Built With Modern Technologies
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {[
              { name: "Next.js 14", desc: "React framework with App Router" },
              { name: "TypeScript", desc: "Type safety and better DX" },
              { name: "Material-UI", desc: "Beautiful UI components" },
              { name: "Prisma", desc: "Database ORM" },
              { name: "PostgreSQL", desc: "Reliable database" },
              { name: "JWT", desc: "Secure authentication" },
            ].map((tech, index) => (
              <Box key={index} textAlign="center" p={2}>
                <Typography variant="h6" gutterBottom>
                  {tech.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tech.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!user && (
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Join thousands of users who trust MyMentor for their interview
            platform needs.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<RegisterIcon />}
              onClick={() => router.push("/auth/register")}
            >
              Create Free Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
