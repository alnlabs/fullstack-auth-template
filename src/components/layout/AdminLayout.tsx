"use client";

import { ReactNode, useState } from "react";
import { Box, Toolbar, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AdminOnly } from "@/lib/route-guard";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AdminOnly>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <AdminHeader onMenuClick={toggleSidebar} />
        <AdminSidebar 
          open={sidebarOpen} 
          drawerWidth={drawerWidth}
          collapsedWidth={collapsedDrawerWidth}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            width: { 
              sm: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)` 
            },
            ml: { 
              sm: `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px` 
            },
            transition: "width 0.2s, margin-left 0.2s",
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </AdminOnly>
  );
}
