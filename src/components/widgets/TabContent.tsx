"use client";

import { ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { spacing } from "@/lib/spacing";

interface TabContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  rightControls?: ReactNode;
}

export default function TabContent({
  title,
  children,
  rightControls,
  subtitle,
}: TabContentProps) {
  const hasHeader = title || rightControls;

  return (
    <Box sx={{ width: 1, maxWidth: "none", overflow: "hidden" }}>
      {/* Header - only show if title or rightControls are provided */}
      {hasHeader && (
        <Box sx={spacing.header}>
          {(title || subtitle) && (
            <Box>
              {title && (
                <Typography variant="h4" component="h1" fontWeight={600}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, fontWeight: 400 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
          {rightControls && <Box>{rightControls}</Box>}
        </Box>
      )}

      {/* Content */}
      {children}
    </Box>
  );
}
