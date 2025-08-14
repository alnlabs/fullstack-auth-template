"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "@/lib/auth-context";
import { AuthenticatedOnly } from "@/lib/route-guard";
import { ToastUtils, ToastMessages } from "@/lib/toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: "uploading" | "success" | "error";
}

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!user) {
    return null; // RouteGuard will handle the redirect
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        ToastUtils.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      // Create a temporary file entry
      const tempFile: UploadedFile = {
        id: `temp-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: "uploading",
      };

      setUploadedFiles(prev => [...prev, tempFile]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/users/upload-document", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Update file status to success
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === tempFile.id
                ? { ...f, id: data.fileId, status: "success" as const }
                : f
            )
          );
          ToastUtils.success(`File ${file.name} uploaded successfully!`);
        } else {
          // Update file status to error
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === tempFile.id
                ? { ...f, status: "error" as const }
                : f
            )
          );
          ToastUtils.error(data.error || `Failed to upload ${file.name}`);
        }

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        // Update file status to error
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === tempFile.id
              ? { ...f, status: "error" as const }
              : f
          )
        );
        ToastUtils.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/users/documents/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        ToastUtils.success(`File ${fileName} deleted successfully!`);
      } else {
        ToastUtils.error(`Failed to delete ${fileName}`);
      }
    } catch (error) {
      ToastUtils.error(`Failed to delete ${fileName}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <LinearProgress sx={{ width: 20, height: 20 }} />;
      case "success":
        return <SuccessIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <FileIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "warning";
      case "success":
        return "success";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <AuthenticatedOnly>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            File Upload
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Files
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Upload documents, images, or other files. Maximum file size is 5MB.
                </Typography>

                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "action.hover",
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Click to Upload
                  </Typography>
                  <Typography color="text.secondary">
                    or drag and drop files here
                  </Typography>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  disabled={uploading}
                />

                {uploading && (
                  <Box mt={2}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Uploading... {Math.round(uploadProgress)}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* File List */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Files
                </Typography>
                
                {uploadedFiles.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    No files uploaded yet
                  </Typography>
                ) : (
                  <List>
                    {uploadedFiles.map((file) => (
                      <ListItem
                        key={file.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            disabled={file.status === "uploading"}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          {getStatusIcon(file.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                              </Typography>
                              <Chip
                                label={file.status}
                                color={getStatusColor(file.status)}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AuthenticatedOnly>
  );
}
