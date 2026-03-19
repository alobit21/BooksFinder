import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Mock user storage for demo
const users = new Map()

// Create a test user for easy login
const createTestUser = async () => {
  const testEmail = "test@example.com"
  const testPassword = "password123"
  const hashedPassword = await bcrypt.hash(testPassword, 12)
  
  users.set(testEmail, {
    id: "1",
    email: testEmail,
    name: "Test User",
    password: hashedPassword
  })
}

// Initialize test user
createTestUser()

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "demo-secret-change-in-production",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Check if user exists
        const user = users.get(email)
        
        if (!user) {
          console.log("User not found:", email)
          console.log("Available users:", Array.from(users.keys()))
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          console.log("Invalid password for user:", email)
          return null
        }

        console.log("Authentication successful for user:", email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})

// Helper function to create users (for registration)
export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = {
    id: Date.now().toString(),
    email,
    name,
    password: hashedPassword
  }
  users.set(email, user)
  return user
}
