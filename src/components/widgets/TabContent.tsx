"use client";

import { ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { spacing } from "@/lib/spacing";

interface TabContentProps {
  title: string;
  children: ReactNode;
  rightControls?: ReactNode;
  subtitle?: string;
}

export default function TabContent({ 
  title, 
  children, 
  rightControls, 
  subtitle 
}: TabContentProps) {
  return (
    <Box sx={{ width: 1, maxWidth: "none", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={spacing.header}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mt: 1, fontWeight: 400 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {rightControls && (
          <Box>
            {rightControls}
          </Box>
        )}
      </Box>

      {/* Content */}
      {children}
    </Box>
  );
}
