"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient, isDemoMode } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode - simulate authentication
        if (isLogin) {
          // For demo, any email/password combination works
          const mockUser = {
            id: "demo-user-" + Date.now(),
            email,
            user_metadata: { username: email.split("@")[0] },
          }
          localStorage.setItem("mock-user", JSON.stringify(mockUser))
          router.push("/dashboard")
        } else {
          // Demo signup
          const mockUser = {
            id: "demo-user-" + Date.now(),
            email,
            user_metadata: { username, full_name: fullName },
          }
          localStorage.setItem("mock-user", JSON.stringify(mockUser))
          router.push("/dashboard")
        }
      } else {
        // Real Supabase authentication
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error
          router.push("/dashboard")
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          if (error) throw error

          if (data.user) {
            const { error: profileError } = await supabase.from("users").insert([
              {
                id: data.user.id,
                email,
                username,
                full_name: fullName,
              },
            ])

            if (profileError) throw profileError
            router.push("/dashboard")
          }
        }
      }
    } catch (error: any) {
      alert(error.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 block">
            StackIt
          </Link>
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>{isLogin ? "Sign in to your account" : "Join our community today"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
