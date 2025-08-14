import { UserRole, UserStatus } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
      status: UserStatus
      provider?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: UserRole
    status: UserStatus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    status: UserStatus
  }
}
