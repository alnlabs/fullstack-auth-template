"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Divider,
} from "@mui/material";
import {
  Login as LoginIcon,
} from "@mui/icons-material";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.emailOrUsername, formData.password);
      // Toast notifications are handled by the auth context
    } catch (error) {
      // Error handling is done by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Username"
              type="text"
              value={formData.emailOrUsername}
              onChange={(e) =>
                setFormData({ ...formData, emailOrUsername: e.target.value })
              }
              margin="normal"
              required
              autoComplete="username"
              placeholder="Enter your email or username"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              margin="normal"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Link href="/auth/forgot-password" variant="body2">
              Forgot your password?
            </Link>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account? <Link href="/auth/register">Sign up</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
