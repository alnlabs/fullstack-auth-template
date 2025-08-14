import { User, UserRole, UserStatus, AuthProvider } from '@prisma/client'

export interface AuthUser extends Omit<User, 'password'> {
  password?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  username?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: AuthUser
  token?: string
  refreshToken?: string
}

export interface GoogleAuthData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  avatar?: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordResetConfirmData {
  token: string
  password: string
}

export interface EmailVerificationData {
  token: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  phone?: string
  location?: string
  timezone?: string
  language?: string
  currency?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences?: Record<string, any>
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  status: UserStatus
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenId: string
  iat?: number
  exp?: number
}

export interface UserLogData {
  userId: string
  action: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export type UserRoleType = UserRole
export type UserStatusType = UserStatus
export type AuthProviderType = AuthProvider
