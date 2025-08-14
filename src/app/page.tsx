"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Chip,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Simple loading state
  if (status === "loading") {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Fullstack Auth Template
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          A simple, secure authentication system with Next.js, MUI, and Firebase
        </Typography>
      </Box>

      {/* Features Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          mb: 6,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              🔐 Secure Authentication
            </Typography>
            <Typography color="text.secondary">
              Local credentials and Google OAuth with Firebase
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              👥 User Management
            </Typography>
            <Typography color="text.secondary">
              Role-based access control and user profiles
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              📁 File Upload
            </Typography>
            <Typography color="text.secondary">
              Avatar and document upload with validation
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Authentication Options */}
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Get Started
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Choose your authentication method
        </Typography>

        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<RegisterIcon />}
            onClick={() => router.push("/auth/register")}
          >
            Register
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={() => router.push("/api/auth/signin")}
          >
            Sign in with Google
          </Button>
        </Box>

        <Box mt={3}>
          <Button variant="text" onClick={() => router.push("/demo")}>
            View Demo
          </Button>
        </Box>
      </Paper>

      {/* Tech Stack */}
      <Box mt={6} textAlign="center">
        <Typography variant="h6" gutterBottom>
          Built with
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          {[
            "Next.js",
            "React",
            "TypeScript",
            "MUI",
            "Firebase",
            "Prisma",
            "PostgreSQL",
          ].map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
