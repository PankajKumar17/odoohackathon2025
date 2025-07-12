"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, User, LogOut, Sparkles } from "lucide-react"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"
import NotificationDropdown from "@/components/notification-dropdown"

interface NavigationProps {
  showAuthButtons?: boolean
}

export default function Navigation({ showAuthButtons = true }: NavigationProps) {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      if (isDemoMode) {
        const mockUser = getMockUser()
        setUser(mockUser)
        if (mockUser) {
          setNotifications([
            {
              id: "1",
              type: "answer",
              message: "Jane Smith answered your question about React learning",
              read: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "2",
              type: "question",
              message: "New question posted in JavaScript category",
              read: false,
              created_at: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              id: "3",
              type: "trending",
              message: "Your question is trending! 🔥",
              read: true,
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
          ])
        }
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: notificationData } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          setNotifications(notificationData || [])
        }
      }
    }

    getUser()
  }, [supabase])

  const handleLogout = async () => {
    if (isDemoMode) {
      localStorage.removeItem("mock-user")
    } else {
      await supabase.auth.signOut()
    }
    setUser(null)
    router.push("/")
  }

  const handleMarkAsRead = async (notificationId: string) => {
    if (isDemoMode) {
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    } else {
      await supabase.from("notifications").update({ read: true }).eq("id", notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    }
  }

  const handleMarkAllAsRead = async () => {
    if (isDemoMode) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } else {
      if (user) {
        await supabase.from("notifications").update({ read: true }).eq("user_id", user.id)
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }
    }
  }

  if (!showAuthButtons || !user) {
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            StackIt
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            size="sm"
            asChild
            className={`transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "hover:bg-gray-100"
            }`}
          >
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button
            variant={isActive("/profile") ? "default" : "ghost"}
            size="sm"
            asChild
            className={`transition-all duration-200 ${
              isActive("/profile")
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "hover:bg-gray-100"
            }`}
          >
            <Link href="/profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>

          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />

          {/* User Avatar */}
          <div className="flex items-center space-x-3 ml-2 pl-2 border-l border-gray-200">
            <Avatar className="h-8 w-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                {(user.user_metadata?.username || user.email)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
