"use client";

import { ReactNode, useState } from "react";
import { Box, Toolbar } from "@mui/material";
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
      <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
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
            minHeight: "100vh",
            maxWidth: "none",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Box
            sx={{
              p: 3, // Add padding to tab content area
              width: 1, // This is 100% according to MUI System
              maxWidth: "none",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </AdminOnly>
  );
}
