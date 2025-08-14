"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

interface AdminSidebarProps {
  open: boolean;
  drawerWidth: number;
  collapsedWidth: number;
}

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
  { text: "Users", icon: PeopleIcon, path: "/admin/users" },
  { text: "Analytics", icon: AssessmentIcon, path: "/admin/analytics" },
  { text: "Security", icon: SecurityIcon, path: "/admin/security" },
];

export default function AdminSidebar({
  open,
  drawerWidth,
  collapsedWidth,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          top: "64px", // Account for AppBar height
          height: "calc(100vh - 64px)",
          overflowX: "hidden",
          transition: "width 0.2s",
          position: "fixed",
          left: 0,
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 1 }}>
        <List>
          <ListItem disablePadding>
            <Tooltip
              title="Back to Site"
              placement="right"
              disableHoverListener={open}
            >
              <ListItemButton
                onClick={handleHome}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Back to Site" />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        <Divider />

        <List>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding>
                <Tooltip
                  title={item.text}
                  placement="right"
                  disableHoverListener={open}
                >
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        "&:hover": {
                          backgroundColor: "primary.light",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Icon color={isActive ? "primary" : "inherit"} />
                    </ListItemIcon>
                    {open && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
