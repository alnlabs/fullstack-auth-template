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
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
            marginLeft: `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px`,
            transition: "margin-left 0.2s",
            width: `calc(100vw - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`,
            maxWidth: "none",
            backgroundColor: "lightblue",
            border: "3px solid green",
          }}
        >
          <Toolbar />
          <Box 
            sx={{ 
              p: 1, 
              width: "100%", 
              maxWidth: "none",
              backgroundColor: "pink",
              border: "3px solid purple",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </AdminOnly>
  );
}
