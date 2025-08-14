'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  PrivacyTip as PrivacyIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowSearch: true,
  })

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to change password')
      } else {
        setMessage('Password changed successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to delete account')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Security Settings
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage your account security and password settings.
              </Typography>

              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                margin="normal"
              />

              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                margin="normal"
                helperText="Password must be at least 8 characters long"
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                margin="normal"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                }
                label="Show password"
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword}
                sx={{ mt: 2 }}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Notification Settings
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Control how you receive notifications and updates.
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive important updates via email"
                  />
                  <Switch
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      emailNotifications: e.target.checked
                    })}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive real-time notifications"
                  />
                  <Switch
                    checked={notifications.pushNotifications}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      pushNotifications: e.target.checked
                    })}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Marketing Emails"
                    secondary="Receive promotional content and offers"
                  />
                  <Switch
                    checked={notifications.marketingEmails}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      marketingEmails: e.target.checked
                    })}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Get notified about security events"
                  />
                  <Switch
                    checked={notifications.securityAlerts}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      securityAlerts: e.target.checked
                    })}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PrivacyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Privacy Settings
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Control your privacy and data sharing preferences.
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Profile Visibility"
                    secondary="Control who can see your profile"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Show Email Address"
                    secondary="Display your email to other users"
                  />
                  <Switch
                    checked={privacy.showEmail}
                    onChange={(e) => setPrivacy({
                      ...privacy,
                      showEmail: e.target.checked
                    })}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Show Phone Number"
                    secondary="Display your phone number to other users"
                  />
                  <Switch
                    checked={privacy.showPhone}
                    onChange={(e) => setPrivacy({
                      ...privacy,
                      showPhone: e.target.checked
                    })}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Allow Search"
                    secondary="Let others find you in search results"
                  />
                  <Switch
                    checked={privacy.allowSearch}
                    onChange={(e) => setPrivacy({
                      ...privacy,
                      allowSearch: e.target.checked
                    })}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Manage your account and data.
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Download My Data"
                    secondary="Export all your data and information"
                  />
                  <Button variant="outlined" size="small">
                    Download
                  </Button>
                </ListItem>

                {/* Hide deactivate and delete for admin users */}
                {session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPERADMIN' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="Deactivate Account"
                        secondary="Temporarily disable your account"
                      />
                      <Button variant="outlined" color="warning" size="small">
                        Deactivate
                      </Button>
                    </ListItem>

                    <Divider sx={{ my: 2 }} />

                    <ListItem>
                      <ListItemIcon>
                        <DeleteIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete Account"
                        secondary="Permanently delete your account and all data"
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete
                      </Button>
                    </ListItem>
                  </>
                )}

                {/* Show message for admin users */}
                {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPERADMIN') && (
                  <ListItem>
                    <ListItemText
                      primary="Account Protection"
                      secondary="Admin accounts are protected from deletion and deactivation for security reasons"
                      primaryTypographyProps={{ color: 'primary' }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            All your data, files, and information will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
