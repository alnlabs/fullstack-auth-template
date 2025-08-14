"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material";

export default function PublicHeader() {
  const router = useRouter();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "transparent" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer", color: "primary.main" }}
          onClick={() => router.push("/")}
        >
          MyMentor
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="primary"
            size="small"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push("/auth/register")}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
