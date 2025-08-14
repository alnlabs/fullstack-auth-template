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
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
} from "@mui/icons-material";

export default function DemoPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    {
      title: "Authentication",
      items: [
        "Local email/password login",
        "Google OAuth with Firebase",
        "Role-based access control",
        "Session management",
        "Password reset functionality",
      ],
    },
    {
      title: "User Management",
      items: [
        "User registration & profiles",
        "Admin user management",
        "Role assignment",
        "Account status management",
        "Activity logging",
      ],
    },
    {
      title: "File Upload",
      items: [
        "Avatar upload (2MB max)",
        "Document upload (5MB max)",
        "File type validation",
        "Bulk upload support",
        "Admin file management",
      ],
    },
    {
      title: "Security",
      items: [
        "Password hashing (bcrypt)",
        "JWT token management",
        "Input validation & sanitization",
        "Rate limiting",
        "CSRF protection",
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Template Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          See what this template includes
        </Typography>
      </Box>

      {!session && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Demo Mode:</strong> You're viewing this as a guest.
            <Button
              variant="text"
              onClick={() => router.push("/auth/login")}
              sx={{ ml: 1, p: 0, minWidth: "auto" }}
            >
              Sign in
            </Button>
            to access the full dashboard.
          </Typography>
        </Alert>
      )}

      {/* Features Grid */}
      <Grid container spacing={4} mb={6}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <List dense>
                  {feature.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tech Stack */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Built With
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { name: "Next.js 14", desc: "React framework" },
              { name: "TypeScript", desc: "Type safety" },
              { name: "Material-UI", desc: "UI components" },
              { name: "Firebase", desc: "Google OAuth" },
              { name: "Prisma", desc: "Database ORM" },
              { name: "PostgreSQL", desc: "Database" },
            ].map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h6" gutterBottom>
                    {tech.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tech.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/auth/register")}
          >
            Create Account
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </Button>
          <Button variant="text" size="large" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
