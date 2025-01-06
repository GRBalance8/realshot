// src/types/next-auth.d.ts
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      isFirstTimeUser: boolean
    }
  }
  
  interface User {
    role: UserRole
    isFirstTimeUser: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isFirstTimeUser: boolean
  }
}
