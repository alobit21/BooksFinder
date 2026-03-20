"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AuthUI } from "@/components/ui/auth-fuse"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (name: string, email: string, password: string, confirmPassword: string) => {
    // Redirect to signup page
    router.push("/auth/signup")
  }

  return (
    <AuthUI 
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      isLoading={isLoading}
      error={error}
    />
  )
}
