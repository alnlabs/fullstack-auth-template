"use client";

import { useState, useEffect } from "react";
import { AdminOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as SuperAdminIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Block as SuspendedIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import AdminLayout from "@/components/layout/AdminLayout";
import TabContent from "@/components/widgets/TabContent";
import { spacing } from "@/lib/spacing";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
  image?: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return <SuperAdminIcon />;
      case "ADMIN":
        return <AdminIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "error";
      case "ADMIN":
        return "warning";
      default:
        return "primary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <ActiveIcon />;
      case "INACTIVE":
        return <InactiveIcon />;
      case "SUSPENDED":
        return <SuspendedIcon />;
      default:
        return <InactiveIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "default";
      case "SUSPENDED":
        return "error";
      default:
        return "default";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    admins: users.filter((u) => u.role === "ADMIN" || u.role === "SUPERADMIN")
      .length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
  };

  const rightControls = (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <FormControlLabel
        control={
          <Switch
            checked={viewMode === "grid"}
            onChange={(e) => setViewMode(e.target.checked ? "grid" : "list")}
            size="small"
          />
        }
        label={viewMode === "grid" ? "Grid" : "List"}
      />
      <Button variant="contained" startIcon={<AddIcon />} size="medium">
        Add User
      </Button>
    </Box>
  );

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <TabContent
        title="User Management"
        subtitle="Manage users, roles, and permissions"
        rightControls={rightControls}
      >
        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 1.5,
            mb: 3,
            p: 2,
          }}
        >
          <Card sx={{ ...spacing.card, height: "auto", minHeight: "80px" }}>
            <CardContent sx={{ textAlign: "center", py: 1.5, px: 1 }}>
              <Typography variant="h5" color="primary" fontWeight={700}>
                {stats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ ...spacing.card, height: "auto", minHeight: "80px" }}>
            <CardContent sx={{ textAlign: "center", py: 1.5, px: 1 }}>
              <Typography variant="h5" color="success.main" fontWeight={700}>
                {stats.active}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ ...spacing.card, height: "auto", minHeight: "80px" }}>
            <CardContent sx={{ textAlign: "center", py: 1.5, px: 1 }}>
              <Typography variant="h5" color="warning.main" fontWeight={700}>
                {stats.admins}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrators
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ ...spacing.card, height: "auto", minHeight: "80px" }}>
            <CardContent sx={{ textAlign: "center", py: 1.5, px: 1 }}>
              <Typography variant="h5" color="error.main" fontWeight={700}>
                {stats.suspended}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Suspended
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPERADMIN">Super Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </Select>
              </FormControl>

              <Chip
                icon={<FilterIcon />}
                label={`${filteredUsers.length} of ${users.length} users`}
                variant="outlined"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Users Grid/List */}
        {viewMode === "grid" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {filteredUsers.length === 0 ? (
              <Card sx={spacing.card}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ||
                    roleFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No users match your filters"
                      : "No users found"}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} sx={{ ...spacing.card, height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor:
                                getStatusColor(user.status || "ACTIVE") +
                                ".main",
                              border: "2px solid white",
                            }}
                          />
                        }
                      >
                        <Avatar
                          src={user.image || undefined}
                          sx={{ width: 56, height: 56 }}
                        >
                          {getRoleIcon(user.role || "USER")}
                        </Avatar>
                      </Badge>
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {user.name || "No Name"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email || "No Email"}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        icon={getRoleIcon(user.role || "USER")}
                        label={user.role || "USER"}
                        color={getRoleColor(user.role || "USER")}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={getStatusIcon(user.status || "ACTIVE")}
                        label={user.status || "ACTIVE"}
                        color={getStatusColor(user.status || "ACTIVE")}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Joined:{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle Status">
                          <IconButton
                            size="small"
                            color={
                              user.status === "ACTIVE" ? "warning" : "success"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                user.id,
                                user.status || "ACTIVE"
                              )
                            }
                          >
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        ) : (
          <Card sx={spacing.card}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User List ({filteredUsers.length})
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {filteredUsers.length === 0 ? (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    {searchTerm ||
                    roleFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No users match your filters"
                      : "No users found"}
                  </Typography>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id} variant="outlined" sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar src={user.image || undefined}>
                          {getRoleIcon(user.role || "USER")}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {user.name || "No Name"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email || "No Email"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <Chip
                            label={user.role || "USER"}
                            color={getRoleColor(user.role || "USER")}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={user.status || "ACTIVE"}
                            color={getStatusColor(user.status || "ACTIVE")}
                            size="small"
                          />
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </TabContent>
    </AdminLayout>
  );
}
