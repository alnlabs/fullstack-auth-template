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
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <AdminHeader onMenuClick={toggleSidebar} />
        <AdminSidebar
          open={sidebarOpen}
          drawerWidth={drawerWidth}
          collapsedWidth={collapsedDrawerWidth}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            height: "100vh",
            width: `calc(100vw - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`,
            marginLeft: `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px`,
            transition: "width 0.2s, margin-left 0.2s",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
