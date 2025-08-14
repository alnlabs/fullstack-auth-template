"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Upload as UploadIcon,
  Science as DemoIcon,
} from "@mui/icons-material";
import { useState, memo } from "react";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/lib/auth";

interface NavigationProps {
  user: User;
}

// Memoize the component to prevent unnecessary re-renders
const Navigation = memo(function Navigation({ user }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    // Toast notifications are handled by the auth context
  };

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

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          MyMentor
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          {/* Dashboard Link */}
          <Button
            color="inherit"
            startIcon={isAdmin ? <AdminIcon /> : <DashboardIcon />}
            onClick={() =>
              router.push(isAdmin ? "/admin/dashboard" : "/dashboard")
            }
            sx={{
              backgroundColor:
                pathname === (isAdmin ? "/admin/dashboard" : "/dashboard")
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </Button>

          {/* Profile Link */}
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => router.push("/profile")}
            sx={{
              backgroundColor:
                pathname === "/profile"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Profile
          </Button>

          {/* Upload Link */}
          <Button
            color="inherit"
            startIcon={<UploadIcon />}
            onClick={() => router.push("/upload")}
            sx={{
              backgroundColor:
                pathname === "/upload"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Upload
          </Button>

          {/* Settings Link */}
          <Button
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={() => router.push("/settings")}
            sx={{
              backgroundColor:
                pathname === "/settings"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Settings
          </Button>

          {/* Demo Link */}
          <Button
            color="inherit"
            startIcon={<DemoIcon />}
            onClick={() => router.push("/demo")}
            sx={{
              backgroundColor:
                pathname === "/demo"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            Demo
          </Button>
        </Box>

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={user.role}
            color={getRoleColor(user.role)}
            size="small"
          />
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              src={user.image || undefined}
              sx={{ width: 32, height: 32 }}
            >
              {user.name?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => router.push("/profile")}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => router.push("/settings")}>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Navigation;
