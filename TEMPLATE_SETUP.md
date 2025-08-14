# 🚀 Fullstack Authentication Template - Setup Guide

This is a comprehensive fullstack authentication and file management system built with Next.js 14, Prisma, PostgreSQL, and Firebase. Use this as a starting template for your projects.

## ✨ Features Included

### 🔐 Authentication System
- **Local Authentication** - Email/username + password login
- **Google OAuth** - Firebase-powered Google authentication
- **Role-Based Access Control** - SuperAdmin, Admin, User roles
- **Email Verification** - Secure email verification flow
- **Password Reset** - Forgot password and reset functionality
- **Session Management** - NextAuth.js integration
- **Account Security** - Login attempts, account locking, activity logging

### 📁 File Management
- **Avatar Upload** - Profile picture management
- **Document Upload** - Resume, portfolio, certificate uploads
- **Bulk Upload** - Multiple file upload support
- **File Categories** - Organized document management
- **Admin Oversight** - Complete file management for admins

### 🛡️ Security Features
- **Password Hashing** - Bcrypt encryption
- **JWT Tokens** - Secure token management
- **Input Validation** - Zod schema validation
- **Rate Limiting** - Protection against abuse
- **File Validation** - Type and size restrictions
- **Activity Logging** - Complete audit trail

### 🗄️ Database
- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Type-safe database operations
- **Migrations** - Database schema management
- **Seeding** - Initial data setup

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

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone git@github.com:alnlabs/fullstack-auth-template.git
cd fullstack-auth-template
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template and configure your variables:
```bash
cp env.example .env.local
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mymentor_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:4800"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 4. Start Development Environment
```bash
# Start Docker services
./scripts/docker-dev.sh start

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start the development server
npm run dev
```

Your application will be available at `http://localhost:4800`

## 🔧 Configuration

### Database Setup
The template uses PostgreSQL with Docker Compose. Three environments are configured:

- **Development**: `docker-compose.dev.yml`
- **Testing**: `docker-compose.test.yml`
- **Production**: `docker-compose.prod.yml`

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Google provider
3. Get your Firebase configuration from Project Settings
4. Update environment variables with your Firebase config
5. Configure Firebase Authentication rules in `firestore.rules` and `storage.rules`

## 📚 API Documentation

Complete API documentation is available in `API_ENDPOINTS.md` with:
- 22 comprehensive endpoints
- Request/response examples
- Authentication flows
- File upload specifications
- Error handling

## 🗄️ Database Schema

### Core Models
- **User** - Complete user profiles with authentication
- **Session** - NextAuth session management
- **RefreshToken** - JWT refresh token handling
- **UserLog** - Activity logging and audit trail
- **UserDocument** - File upload management
- **VerificationToken** - Email verification tokens

### Key Features
- UUID primary keys
- Automatic timestamps
- Soft deletes support
- JSON fields for flexible data
- Proper relationships and constraints

## 🛠️ Customization Guide

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

### Custom Authentication Providers
1. Add new provider to `AuthProvider` enum
2. Configure NextAuth provider in `firebase-auth-provider.ts`
3. Update authentication logic

## 🧪 Testing

### Database Testing
```bash
# Start test environment
./scripts/docker-test.sh start

# Run tests
npm run test
```

### API Testing
Use the provided endpoints with tools like:
- Postman
- Insomnia
- Thunder Client (VS Code)

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Set up production database
3. Configure reverse proxy (Nginx)
4. Set up monitoring (Prometheus/Grafana)

### Docker Deployment
```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 File Structure

### Upload Directories
Files are stored in organized directories:
- `/public/uploads/avatars/` - Profile pictures
- `/public/uploads/documents/` - User documents

### Security
- File type validation
- Size limits enforced
- Unique filename generation
- User ownership verification

## 🔐 Security Considerations

### Authentication
- Bcrypt password hashing
- JWT token management
- Session security
- Rate limiting

### File Upload
- Type validation
- Size restrictions
- Malware scanning (recommended)
- Secure file serving

### Database
- Parameterized queries (Prisma)
- Input validation
- SQL injection protection

## 🎯 Next Steps

### Frontend Development
1. Create authentication UI components
2. Build user dashboard
3. Implement file upload interface
4. Create admin panel

### Additional Features
1. Email service integration
2. Real-time notifications
3. Advanced file management
4. User analytics
5. API rate limiting
6. Caching layer

### Production Enhancements
1. CDN integration
2. Database optimization
3. Monitoring and logging
4. Backup strategies
5. SSL/TLS configuration

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
1. Check the API documentation
2. Review the database schema
3. Check environment configuration
4. Open an issue on GitHub

---

**Happy Coding! 🚀**

This template provides a solid foundation for building secure, scalable applications with modern authentication and file management capabilities.
