# API Endpoints Documentation

## Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

Register a new user with email, username, and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "status": "PENDING",
    "emailVerified": false
  }
}
```

### 2. Check Username Availability

**POST** `/api/auth/check-username`

Check if a username is available for registration.

**Request Body:**

```json
{
  "username": "username"
}
```

**Response:**

```json
{
  "success": true,
  "available": true
}
```

### 3. Login (NextAuth)

**POST** `/api/auth/signin`

Login using NextAuth.js with email/username and password or Google OAuth.

**Request Body (Credentials):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

### 4. Logout

**POST** `/api/auth/logout`

Logout user and clear all sessions.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Get Session

**GET** `/api/auth/session`

Get current user session information.

**Response:**

```json
{
  "success": true,
  "session": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "role": "USER"
    },
    "expires": "2024-01-01T00:00:00.000Z"
  }
}
```

## Password Management

### 6. Forgot Password

**POST** `/api/users/forgot-password`

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### 7. Reset Password

**POST** `/api/users/reset-password`

Reset password using token from email.

**Request Body:**

```json
{
  "token": "reset-token",
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

### 8. Change Password

**POST** `/api/users/change-password`

Change password for authenticated user.

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Email Verification

### 9. Verify Email

**POST** `/api/auth/verify-email`

Verify email using token from verification email.

**Request Body:**

```json
{
  "token": "verification-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully. You can now login to your account."
}
```

### 10. Resend Verification Email

**POST** `/api/auth/resend-verification`

Resend email verification link.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "If an account with that email exists, a verification link has been sent."
}
```

## User Profile

### 11. Get User Profile

**GET** `/api/users/profile`

Get current user's profile information.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "User bio",
    "phone": "+1234567890",
    "location": "New York",
    "timezone": "America/New_York",
    "language": "en",
    "currency": "USD",
    "website": "https://example.com",
    "socialLinks": {
      "twitter": "https://twitter.com/username",
      "linkedin": "https://linkedin.com/in/username"
    },
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "role": "USER",
    "status": "ACTIVE",
    "emailVerified": true,
    "authProvider": "LOCAL",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "lastActiveAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 12. Update User Profile

**PUT** `/api/users/profile`

Update current user's profile information.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "location": "New York",
  "timezone": "America/New_York",
  "language": "en",
  "currency": "USD",
  "website": "https://example.com",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

## File Upload Endpoints

### 13. Upload Avatar

**POST** `/api/users/upload-avatar`

Upload user profile picture.

**Request Body (FormData):**

- `avatar`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:**

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatar": "/uploads/avatars/avatar_user-id_timestamp.jpg",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "avatar": "/uploads/avatars/avatar_user-id_timestamp.jpg",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe"
  }
}
```

### 14. Upload Document

**POST** `/api/users/upload-document`

Upload a single document.

**Request Body (FormData):**

- `document`: File (PDF, Word, Excel, text, images, max 10MB)
- `category`: "RESUME" | "PORTFOLIO" | "CERTIFICATE" | "OTHER"
- `description`: Optional description (max 500 characters)

**Response:**

```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "id": "document-id",
    "fileName": "resume.pdf",
    "filePath": "/uploads/documents/doc_user-id_timestamp.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "category": "RESUME",
    "description": "My professional resume",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 15. Bulk Upload Documents

**POST** `/api/users/bulk-upload`

Upload multiple documents at once (max 10 files).

**Request Body (FormData):**

- `files`: Array of files (PDF, Word, Excel, text, images, max 10MB each)
- `category`: "RESUME" | "PORTFOLIO" | "CERTIFICATE" | "OTHER"
- `description`: Optional description applied to all files (max 500 characters)

**Response:**

```json
{
  "success": true,
  "message": "Successfully uploaded 3 out of 4 files",
  "uploaded": [
    {
      "id": "document-id-1",
      "fileName": "resume.pdf",
      "filePath": "/uploads/documents/doc_user-id_timestamp_abc123.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "category": "RESUME",
      "description": "My professional resume",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "errors": [
    {
      "fileName": "large-file.pdf",
      "error": "File size must be less than 10MB"
    }
  ],
  "summary": {
    "total": 4,
    "successful": 3,
    "failed": 1
  }
}
```

### 16. Get User Documents

**GET** `/api/users/documents`

Get current user's documents with pagination and filtering.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category (RESUME, PORTFOLIO, CERTIFICATE, OTHER)
- `search`: Search in filename and description

**Response:**

```json
{
  "success": true,
  "documents": [
    {
      "id": "document-id",
      "fileName": "resume.pdf",
      "filePath": "/uploads/documents/doc_user-id_timestamp.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "category": "RESUME",
      "description": "My professional resume",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 17. Get Single Document

**GET** `/api/users/documents/{id}`

Get a specific document by ID.

**Response:**

```json
{
  "success": true,
  "document": {
    "id": "document-id",
    "fileName": "resume.pdf",
    "filePath": "/uploads/documents/doc_user-id_timestamp.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "category": "RESUME",
    "description": "My professional resume",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 18. Update Document

**PUT** `/api/users/documents/{id}`

Update document metadata (description, category).

**Request Body:**

```json
{
  "description": "Updated description",
  "category": "PORTFOLIO"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Document updated successfully",
  "document": {
    // Updated document object
  }
}
```

### 19. Delete Document

**DELETE** `/api/users/documents`

Delete a document.

**Request Body:**

```json
{
  "documentId": "document-id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## Admin Endpoints

### 20. Get All Users (Admin)

**GET** `/api/admin/users`

Get all users with pagination and filtering (Admin/SuperAdmin only).

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for email, username, firstName, lastName, displayName
- `role`: Filter by role (USER, ADMIN, SUPERADMIN)
- `status`: Filter by status (ACTIVE, INACTIVE, SUSPENDED, BANNED)
- `authProvider`: Filter by auth provider (LOCAL, GOOGLE, FIREBASE)

**Response:**

```json
{
  "success": true,
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "role": "USER",
      "status": "ACTIVE",
      "emailVerified": true,
      "authProvider": "LOCAL",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z",
      "lastActiveAt": "2024-01-01T00:00:00.000Z",
      "loginAttempts": 0,
      "lockedUntil": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### 21. Update User (Admin)

**PUT** `/api/admin/users`

Update user information (Admin/SuperAdmin only).

**Request Body:**

```json
{
  "userId": "user-id",
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "role": "ADMIN",
  "status": "ACTIVE",
  "emailVerified": true,
  "bio": "Updated bio",
  "phone": "+1234567890",
  "location": "New York",
  "timezone": "America/New_York",
  "language": "en",
  "currency": "USD",
  "website": "https://example.com",
  "socialLinks": {
    "twitter": "https://twitter.com/username"
  },
  "preferences": {
    "theme": "dark"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    // Updated user object
  }
}
```

### 22. Get All Documents (Admin)

**GET** `/api/admin/documents`

Get all user documents with pagination and filtering (Admin/SuperAdmin only).

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category (RESUME, PORTFOLIO, CERTIFICATE, OTHER)
- `search`: Search in filename, description, or user info
- `userId`: Filter by specific user ID

**Response:**

```json
{
  "success": true,
  "documents": [
    {
      "id": "document-id",
      "fileName": "resume.pdf",
      "filePath": "/uploads/documents/doc_user-id_timestamp.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "category": "RESUME",
      "description": "My professional resume",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user-id",
        "email": "user@example.com",
        "username": "username",
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "role": "USER",
        "status": "ACTIVE"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

### Too Many Requests (429)

```json
{
  "success": false,
  "message": "Please wait 5 minutes before requesting another verification email."
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## File Upload Specifications

### Supported File Types

**Avatar Upload:**

- JPEG, JPG, PNG, WebP
- Maximum size: 5MB

**Document Upload:**

- PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
- Text files (.txt)
- Images (JPEG, JPG, PNG, WebP)
- Maximum size: 10MB per file
- Maximum files per bulk upload: 10

### File Storage

Files are stored in the following structure:

- Avatars: `/public/uploads/avatars/`
- Documents: `/public/uploads/documents/`

Files are accessible via public URLs:

- `http://localhost:4800/uploads/avatars/filename.jpg`
- `http://localhost:4800/uploads/documents/filename.pdf`

### Security Features

- File type validation
- File size limits
- Unique filename generation
- User ownership verification
- Admin access control
- Activity logging for all file operations

## Authentication Flow

1. **Registration**: User registers with email, username, and password
2. **Email Verification**: User receives verification email and clicks link
3. **Login**: User can login with email/username and password or Google OAuth
4. **Session Management**: NextAuth.js handles session management
5. **Password Reset**: User can request password reset via email
6. **Profile Management**: Users can update their profile information
7. **File Upload**: Users can upload avatars and documents
8. **Admin Management**: Admins can manage all users and documents

## Security Features

- Password hashing with bcrypt
- JWT token management
- Rate limiting on sensitive endpoints
- Role-based access control
- Session management
- User activity logging
- Account locking after failed attempts
- Email verification required
- Secure password reset flow
- File upload validation and security
- File ownership verification
