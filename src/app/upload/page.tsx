"use client";

import { useState } from "react";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from "@mui/material";
import {
  Upload as UploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { spacing } from "@/lib/spacing";

interface FileStatus {
  file: File;
  status: "uploading" | "success" | "error";
  progress: number;
  message?: string;
}

export default function UploadPage() {
  const { user } = useAuth();
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFileStatuses: FileStatus[] = files.map((file) => ({
      file,
      status: "uploading",
      progress: 0,
    }));

    setFileStatuses((prev) => [...prev, ...newFileStatuses]);
    handleUpload(files);
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/users/upload-document", {
          method: "POST",
          body: formData,
        });

        setFileStatuses((prev) =>
          prev.map((status) =>
            status.file === file
              ? {
                  ...status,
                  status: response.ok ? "success" : "error",
                  progress: 100,
                  message: response.ok ? "Upload successful" : "Upload failed",
                }
              : status
          )
        );

        if (!response.ok) {
          // Error handling is done by the auth context
        }
      } catch (error) {
        setFileStatuses((prev) =>
          prev.map((status) =>
            status.file === file
              ? {
                  ...status,
                  status: "error",
                  progress: 100,
                  message: "Upload failed",
                }
              : status
          )
        );
      }
    }

    setUploading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <FileIcon />;
    }
  };

  return (
    <AuthenticatedOnly>
      <Box sx={spacing.pageContainer}>
        {/* Header */}
        <Box sx={spacing.header}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Upload Files
          </Typography>
        </Box>

        {/* Upload Section */}
        <Card sx={{ ...spacing.card, ...spacing.sectionSpacing }}>
          <CardContent>
            <Typography variant="h4" sx={spacing.title}>
              Upload Documents
            </Typography>

            <Box sx={{ textAlign: "center", mb: 4 }}>
              <UploadIcon sx={{ ...spacing.icon, color: "primary.main" }} />
              <Typography variant="body1" color="text.secondary" mb={3}>
                Select files to upload to your account
              </Typography>

              <input
                accept="*/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  disabled={uploading}
                  {...spacing.button}
                >
                  {uploading ? "Uploading..." : "Select Files"}
                </Button>
              </label>
            </Box>

            {/* File List */}
            {fileStatuses.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Upload Progress
                </Typography>
                <List>
                  {fileStatuses.map((fileStatus, index) => (
                    <ListItem
                      key={index}
                      sx={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          {getStatusIcon(fileStatus.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={fileStatus.file.name}
                          secondary={fileStatus.message}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={fileStatus.progress}
                        sx={{ width: "100%" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </AuthenticatedOnly>
  );
}
