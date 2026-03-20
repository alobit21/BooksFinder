"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthUI } from "@/components/ui/auth-fuse"

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (email: string, password: string) => {
    // Redirect to signin page
    router.push("/auth/signin")
  }

  const handleSignUp = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        router.push("/auth/signin?message=Registration successful")
      } else {
        const data = await response.json()
        setError(data.error || "An error occurred")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
