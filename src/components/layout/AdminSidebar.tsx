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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
  { text: "Users", icon: PeopleIcon, path: "/admin/users" },
  { text: "Analytics", icon: AssessmentIcon, path: "/admin/analytics" },
  { text: "Security", icon: SecurityIcon, path: "/admin/security" },
];

export default function AdminSidebar() {
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
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: "64px", // Account for AppBar height
          height: "calc(100vh - 64px)",
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleHome}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Back to Site" />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <Icon color={isActive ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
