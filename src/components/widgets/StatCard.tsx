import { Card, CardContent, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  subtitle?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color = "primary",
  subtitle 
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box color={`${color}.main`}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
