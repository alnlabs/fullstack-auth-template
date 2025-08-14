"use client";

import { ReactNode } from "react";
import { Box, Toolbar } from "@mui/material";
import { AdminOnly } from "@/lib/route-guard";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminOnly>
      <Box sx={{ display: "flex" }}>
        <AdminHeader />
        <AdminSidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          {children}
        </Box>
      </Box>
    </AdminOnly>
  );
}
