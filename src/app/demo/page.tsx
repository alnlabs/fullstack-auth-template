"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  HourglassEmpty as LoadingIcon,
} from "@mui/icons-material";
import { ToastUtils, ToastMessages } from "@/lib/toast";

export default function DemoPage() {
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null);

  const handleSuccessToast = () => {
    ToastUtils.success("This is a success message!");
  };

  const handleErrorToast = () => {
    ToastUtils.error("This is an error message!");
  };

  const handleWarningToast = () => {
    ToastUtils.warning("This is a warning message!");
  };

  const handleInfoToast = () => {
    ToastUtils.info("This is an info message!");
  };

  const handleLoadingToast = () => {
    const toastId = ToastUtils.loading("Loading... Please wait.");
    setLoadingToastId(toastId);
    
    // Simulate async operation
    setTimeout(() => {
      ToastUtils.dismiss(toastId);
      ToastUtils.success("Loading completed!");
      setLoadingToastId(null);
    }, 3000);
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Success!") : reject("Failed!");
      }, 2000);
    });

    ToastUtils.promise(
      promise,
      {
        loading: "Processing...",
        success: "Operation completed successfully!",
        error: "Operation failed. Please try again.",
      }
    );
  };

  const handleAuthToasts = () => {
    ToastUtils.success(ToastMessages.auth.loginSuccess);
  };

  const handleProfileToasts = () => {
    ToastUtils.success(ToastMessages.profile.updateSuccess);
  };

  const handleFileToasts = () => {
    ToastUtils.success(ToastMessages.files.uploadSuccess);
  };

  const handleAdminToasts = () => {
    ToastUtils.success(ToastMessages.admin.userCreated);
  };

  const handleDismissAll = () => {
    ToastUtils.dismissAll();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Toast Notification Demo
      </Typography>
      <Typography color="text.secondary" paragraph>
        This page demonstrates the toast notification system with different types of messages and use cases.
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          Toasts appear in the top-right corner of the screen. They automatically disappear after a few seconds,
          or you can click the X to dismiss them manually.
        </Typography>
      </Alert>

      {/* Basic Toast Types */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Basic Toast Types
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<SuccessIcon />}
                onClick={handleSuccessToast}
              >
                Success Toast
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<ErrorIcon />}
                onClick={handleErrorToast}
              >
                Error Toast
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<WarningIcon />}
                onClick={handleWarningToast}
              >
                Warning Toast
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="info"
                startIcon={<InfoIcon />}
                onClick={handleInfoToast}
              >
                Info Toast
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Advanced Toast Features */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Advanced Features
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LoadingIcon />}
                onClick={handleLoadingToast}
                disabled={!!loadingToastId}
              >
                Loading Toast
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handlePromiseToast}
              >
                Promise Toast
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleDismissAll}
              >
                Dismiss All
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Predefined Messages */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Predefined Messages
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAuthToasts}
              >
                Auth Messages
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleProfileToasts}
              >
                Profile Messages
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleFileToasts}
              >
                File Messages
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdminToasts}
              >
                Admin Messages
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Usage Examples
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box component="pre" sx={{ 
            backgroundColor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
{`// Basic usage
ToastUtils.success("Operation completed!");
ToastUtils.error("Something went wrong!");
ToastUtils.warning("Please check your input");
ToastUtils.info("Here's some information");

// With custom options
ToastUtils.success("Custom message", {
  duration: 6000,
  position: 'bottom-center'
});

// Promise-based
ToastUtils.promise(
  asyncOperation(),
  {
    loading: 'Processing...',
    success: 'Success!',
    error: 'Failed!'
  }
);

// Predefined messages
ToastUtils.success(ToastMessages.auth.loginSuccess);
ToastUtils.error(ToastMessages.profile.updateError);`}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
