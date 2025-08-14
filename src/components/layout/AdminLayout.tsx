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
      <Box className="admin-layout" sx={{ display: "flex" }}>
        <AdminHeader onMenuClick={toggleSidebar} />
        <AdminSidebar
          open={sidebarOpen}
          drawerWidth={drawerWidth}
          collapsedWidth={collapsedDrawerWidth}
        />

        <Box
          component="main"
          className="admin-content"
          sx={{
            flexGrow: 1,
            width: {
              sm: `calc(100vw - ${
                sidebarOpen ? drawerWidth : collapsedDrawerWidth
              }px)`,
            },
            ml: {
              sm: `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px`,
            },
            transition: "width 0.2s, margin-left 0.2s",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Box 
            sx={{ 
              flex: 1, 
              p: 3, 
              overflow: "auto",
              width: "100%",
              height: "100%",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </AdminOnly>
  );
}
