"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [description, setDescription] = useState("");

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    const newFiles: FileWithPreview[] = selectedFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("description", description);

        const response = await fetch("/api/users/upload-document", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);

        return { success: true, file: file.name, data };
      });

      await Promise.all(uploadPromises);
      setMessage(`Successfully uploaded ${files.length} file(s)`);
      setFiles([]);
      setCategory("OTHER");
      setDescription("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon />;
    }
    return <DescriptionIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (file.size > maxSize) {
      return `File size must be less than 5MB (${file.name})`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type not supported (${file.name})`;
    }

    return null;
  };

  return (
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

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Upload Area */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Files
              </Typography>

              {/* File Input */}
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "primary.50",
                  "&:hover": {
                    backgroundColor: "primary.100",
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Click to select files or drag and drop
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV, Images
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maximum file size: 5MB per file
                </Typography>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.webp,.gif"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              {/* Upload Progress */}
              {uploading && (
                <Box mt={3}>
                  <Typography variant="body2" gutterBottom>
                    Uploading files... {Math.round(uploadProgress)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                </Box>
              )}

              {/* Upload Button */}
              {files.length > 0 && (
                <Box mt={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpload}
                    disabled={uploading}
                    fullWidth
                  >
                    {uploading
                      ? "Uploading..."
                      : `Upload ${files.length} File(s)`}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="RESUME">Resume</MenuItem>
                  <MenuItem value="PORTFOLIO">Portfolio</MenuItem>
                  <MenuItem value="CERTIFICATE">Certificate</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                placeholder="Brief description of the files..."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Selected Files */}
      {files.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Files ({files.length})
            </Typography>

            <Grid container spacing={2}>
              {files.map((file) => {
                const validationError = validateFile(file);

                return (
                  <Grid item xs={12} sm={6} md={4} key={file.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: validationError
                                ? "error.50"
                                : "primary.50",
                              color: validationError
                                ? "error.main"
                                : "primary.main",
                            }}
                          >
                            {getFileIcon(file)}
                          </Box>

                          <Box flex={1}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {file.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatFileSize(file.size)}
                            </Typography>
                            {validationError && (
                              <Typography
                                variant="caption"
                                color="error"
                                display="block"
                              >
                                {validationError}
                              </Typography>
                            )}
                          </Box>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(file.id)}
                            disabled={uploading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        {/* Image Preview */}
                        {file.preview && (
                          <Box mt={2}>
                            <img
                              src={file.preview}
                              alt={file.name}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
