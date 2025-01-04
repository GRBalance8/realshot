// src/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            isFirstTimeUser: true
          }
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isFirstTimeUser: user.isFirstTimeUser
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: user.role || UserRole.USER,
          isFirstTimeUser: user.isFirstTimeUser ?? true
        };
      }

      // Subsequent calls - always fetch latest role from database
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, isFirstTimeUser: true }
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.isFirstTimeUser = dbUser.isFirstTimeUser;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
          return token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.isFirstTimeUser = token.isFirstTimeUser as boolean;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development",
};

// Type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      isFirstTimeUser: boolean;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }

  interface User {
    role: UserRole;
    isFirstTimeUser: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    isFirstTimeUser: boolean;
  }
}

// Helper function to check if user is an admin
export const isAdmin = (session: any) => {
  return session?.user?.role === UserRole.ADMIN;
};

export async function auth() {
  return await getServerSession(authOptions);
}
