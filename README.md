# 🚀 Fullstack Authentication Template

A comprehensive, production-ready fullstack authentication and file management system built with **Next.js 14**, **Prisma**, **PostgreSQL**, and **Firebase**. Perfect as a starting template for your next project.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

## ✨ Features

### 🔐 **Authentication System**

- **Local Authentication** - Email/username + password login
- **Google OAuth** - Firebase-powered Google authentication
- **Role-Based Access Control** - SuperAdmin, Admin, User roles
- **Email Verification** - Secure email verification flow
- **Password Reset** - Forgot password and reset functionality
- **Session Management** - NextAuth.js integration
- **Account Security** - Login attempts, account locking, activity logging

### 📁 **File Management**

- **Avatar Upload** - Profile picture management (5MB max)
- **Document Upload** - Resume, portfolio, certificate uploads (10MB max)
- **Bulk Upload** - Multiple file upload support (up to 10 files)
- **File Categories** - Organized document management
- **Admin Oversight** - Complete file management for admins

### 🛡️ **Security Features**

- **Password Hashing** - Bcrypt encryption
- **JWT Tokens** - Secure token management
- **Input Validation** - Zod schema validation
- **File Validation** - Type and size restrictions
- **Activity Logging** - Complete audit trail
- **Rate Limiting** - Protection against abuse

### 🗄️ **Database**

- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Type-safe database operations
- **Migrations** - Database schema management
- **Seeding** - Initial data setup

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/alnlabs/fullstack-auth-template.git
cd fullstack-auth-template

# Run the automated setup script
./scripts/setup-template.sh
```

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/alnlabs/fullstack-auth-template.git
cd fullstack-auth-template

# Install dependencies
npm install

# Copy environment template
cp env.development .env.local

# Start development environment
./scripts/docker-dev.sh start

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Your application will be available at `http://localhost:4800`

## 📋 Prerequisites

- **Node.js** 18+
- **Docker** & Docker Compose
- **Git**

## ⚙️ Configuration

### Environment Variables

Copy `env.development` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mymentor_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:4800"

# Google OAuth (Firebase)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
```

### Default SuperAdmin

- **Email**: `superadmin@mymentor.com`
- **Password**: `SuperAdmin123!`

## 📚 Documentation

- **[TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)** - Complete setup and customization guide
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Comprehensive API documentation (22 endpoints)
- **[Database Schema](./prisma/schema.prisma)** - Complete database structure

## 🏗️ Architecture

```
fullstack-auth-template/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── users/          # User management endpoints
│   │   │   └── admin/          # Admin endpoints
│   │   └── globals.css
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── firebase-auth-provider.ts # NextAuth configuration
│   └── types/
│       └── auth.ts            # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── docker-compose.dev.yml     # Development environment
├── docker-compose.test.yml    # Testing environment
├── docker-compose.prod.yml    # Production environment
└── scripts/                   # Docker management scripts
```

## 🔌 API Endpoints

### Authentication (6 endpoints)

- `POST /api/auth/register` - User registration
- `POST /api/auth/check-username` - Username availability
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get session

### Password Management (3 endpoints)

- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password
- `POST /api/users/change-password` - Change password

### User Profile (2 endpoints)

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### File Upload (6 endpoints)

- `POST /api/users/upload-avatar` - Upload profile picture
- `POST /api/users/upload-document` - Upload single document
- `POST /api/users/bulk-upload` - Upload multiple documents
- `GET /api/users/documents` - List user documents
- `GET /api/users/documents/{id}` - Get specific document
- `PUT /api/users/documents/{id}` - Update document
- `DELETE /api/users/documents` - Delete document

### Admin Management (3 endpoints)

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users` - Update user (admin)
- `GET /api/admin/documents` - List all documents

## 🛠️ Customization

### Adding New User Fields

1. Update `prisma/schema.prisma`
2. Run migration: `npm run db:migrate`
3. Update TypeScript types in `src/types/auth.ts`
4. Modify API endpoints as needed

### Adding New File Types

1. Update `ALLOWED_TYPES` in upload endpoints
2. Add new categories to `DocumentCategory` enum
3. Update validation schemas

### Adding New Roles

1. Update `UserRole` enum in schema
2. Modify role-based access control in `AuthUtils`
3. Update admin endpoints

## 🧪 Testing

```bash
# Start test environment
./scripts/docker-test.sh start

# Run tests
npm run test
```

## 🚀 Deployment

### Production Setup

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 File Storage

Files are stored in organized directories:

- `/public/uploads/avatars/` - Profile pictures
- `/public/uploads/documents/` - User documents

## 🔐 Security Features

- **Authentication**: Bcrypt password hashing, JWT tokens, session security
- **File Upload**: Type validation, size restrictions, unique filenames
- **Database**: Parameterized queries, input validation, SQL injection protection
- **API**: Rate limiting, role-based access control, activity logging

## 🎯 Use Cases

This template is perfect for:

- **SaaS Applications** - User management and file storage
- **Portfolio Platforms** - Document and media management
- **Learning Management Systems** - User roles and file uploads
- **Content Management Systems** - Admin and user interfaces
- **Any application requiring authentication and file management**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This template is provided as-is for educational and commercial use.

## 🆘 Support

For issues and questions:

1. Check the [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) guide
2. Review the [API_ENDPOINTS.md](./API_ENDPOINTS.md) documentation
3. Check environment configuration
4. Open an issue on GitHub

---

**Ready to build something amazing? Start with this template! 🚀**

This template provides a solid foundation for building secure, scalable applications with modern authentication and file management capabilities.
