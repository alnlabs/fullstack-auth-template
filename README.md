# MyMentor Web - Authentication Platform

A comprehensive authentication system built with Next.js, Node.js, Passport, Prisma, and PostgreSQL, featuring Google OAuth, role-based access control, and Docker support for development, testing, and production environments.

## 🚀 Features

### Authentication & Authorization

- **Multi-provider Authentication**: Local credentials + Google OAuth
- **Role-based Access Control**: SuperAdmin, Admin, User roles
- **JWT Token Management**: Access tokens + Refresh tokens
- **Email Verification**: Secure email verification system
- **Password Reset**: Secure password reset functionality
- **Account Locking**: Brute force protection with account locking
- **Session Management**: Secure session handling with NextAuth.js

### User Management

- **Comprehensive User Profiles**: 20+ user fields including bio, location, preferences
- **Social Links**: LinkedIn, GitHub, Twitter, and more
- **User Preferences**: Theme, notifications, language, currency
- **Activity Logging**: Complete audit trail of user actions
- **Status Management**: Active, Inactive, Suspended, Pending Verification

### Database & Infrastructure

- **PostgreSQL Database**: Robust relational database with Prisma ORM
- **Docker Support**: Complete containerization for all environments
- **Environment Separation**: Development, Testing, Production configs
- **Database Migrations**: Automated schema management
- **Data Seeding**: Pre-populated with test users and roles

### Security Features

- **Password Hashing**: Bcrypt with configurable rounds
- **Rate Limiting**: API rate limiting protection
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM protection
- **XSS Protection**: Content Security Policy

### Monitoring & Development

- **PgAdmin**: Database management interface
- **MailHog**: Email testing for development
- **Redis**: Caching and session storage
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards
- **Nginx**: Reverse proxy and load balancing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, NextAuth.js
- **Database**: PostgreSQL 15, Prisma ORM
- **Authentication**: Local Auth + Firebase Google OAuth 2.0
- **Containerization**: Docker, Docker Compose
- **Monitoring**: Prometheus, Grafana
- **Email**: Nodemailer, MailHog (dev)
- **Validation**: Zod, Class Validator
- **Security**: Bcrypt, Helmet, CORS

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (for local development without Docker)
- Firebase project (for Google OAuth)
- Google OAuth credentials (for Google sign-in)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd mymentor-web
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
# For development
cp env.development .env.local

# For production
cp env.production .env.production
```

Update the following variables in your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://mymentor_user:mymentor_password_dev@localhost:5432/mymentor_db_dev?schema=public"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT Secrets (Generate secure random strings)
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"


```

### 3. Start Development Environment

```bash
# Start all services (PostgreSQL, Redis, MailHog, PgAdmin)
./scripts/docker-dev.sh setup

# Or start services individually
./scripts/docker-dev.sh start
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run the Application

```bash
npm run dev
```

Access the application at: http://localhost:3000

### 5. Default SuperAdmin User

After running the database seed, you'll have access to a default superadmin user:

- **Email**: `superadmin@mymentor.com`
- **Password**: `superadmin123`
- **Role**: SuperAdmin (full system access)

## 🐳 Docker Environments

### Development Environment

```bash
# Start development environment
./scripts/docker-dev.sh setup

# Services available:
# - App: http://localhost:3000
# - PgAdmin: http://localhost:5050
# - MailHog: http://localhost:8025

# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### Testing Environment

```bash
# Start test environment
./scripts/docker-test.sh setup

# Services available:
# - Test DB: localhost:5433
# - Test Redis: localhost:6380
# - Test MailHog: http://localhost:8026
```

### Production Environment

```bash
# Deploy to production
./scripts/docker-prod.sh deploy

# Services available:
# - App: http://localhost:3000
# - Nginx: http://localhost:80, https://localhost:443
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
```

## 📊 Database Schema

### User Model

```typescript
interface User {
  // Basic Info
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;

  // Contact & Location
  phone?: string;
  location?: string;
  timezone?: string;
  website?: string;

  // Preferences
  language: string;
  currency: string;
  socialLinks?: Record<string, string>;
  preferences?: Record<string, any>;

  // Authentication
  password?: string;
  emailVerified: boolean;
  authProvider: "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB";
  providerId?: string;
  providerData?: any;

  // Security
  loginAttempts: number;
  lockedUntil?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Status & Role
  role: "SUPERADMIN" | "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
}
```

## 🔐 Authentication Flow

### Local Authentication

1. User registers with email/password
2. Email verification sent
3. User verifies email
4. User can login with credentials
5. JWT tokens issued for session management

### Google OAuth

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google returns user data
4. User created/updated in database
5. JWT tokens issued

### Role-based Access

- **SuperAdmin**: Full system access, user management
- **Admin**: User management, content moderation
- **User**: Basic access, profile management

## 🛡️ Security Features

### Password Security

- Bcrypt hashing with configurable rounds
- Minimum 8 character requirement
- Account locking after 5 failed attempts
- Secure password reset flow

### Session Security

- JWT tokens with short expiration (15min)
- Refresh tokens with longer expiration (7 days)
- Secure token storage and rotation
- Session invalidation on logout

### API Security

- Rate limiting on all endpoints
- Input validation with Zod schemas
- CORS protection
- Helmet.js security headers

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (via NextAuth)
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password
- `POST /api/users/forgot-password` - Request password reset

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

## 🧪 Testing

```bash
# Run tests in Docker
./scripts/docker-test.sh test

# Run tests locally
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📦 Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

## 🔧 Development Scripts

```bash
# Development
./scripts/docker-dev.sh start    # Start dev environment
./scripts/docker-dev.sh stop     # Stop dev environment
./scripts/docker-dev.sh logs     # Show dev logs
./scripts/docker-dev.sh setup    # Full dev setup

# Testing
./scripts/docker-test.sh start   # Start test environment
./scripts/docker-test.sh test    # Run tests
./scripts/docker-test.sh stop    # Stop test environment

# Production
./scripts/docker-prod.sh deploy  # Deploy to production
./scripts/docker-prod.sh scale 5 # Scale to 5 replicas
./scripts/docker-prod.sh backup  # Backup database
```

## 📊 Monitoring

### Development Monitoring

- **PgAdmin**: Database management at http://localhost:5050
- **MailHog**: Email testing at http://localhost:8025
- **Application Logs**: `./scripts/docker-dev.sh logs`

### Production Monitoring

- **Prometheus**: Metrics at http://localhost:9090
- **Grafana**: Dashboards at http://localhost:3001
- **Application Logs**: `./scripts/docker-prod.sh logs`

## 🚀 Deployment

### Local Production

```bash
# Build and deploy
./scripts/docker-prod.sh deploy

# Scale application
./scripts/docker-prod.sh scale 3
```

### Cloud Deployment

1. Configure production environment variables
2. Set up SSL certificates in `./nginx/ssl/`
3. Deploy using your preferred cloud provider
4. Configure domain and DNS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Updates

To update the project:

```bash
git pull origin main
npm install
npm run db:generate
npm run db:migrate
```

---

**MyMentor Web** - Building the future of mentorship platforms with secure, scalable authentication.
