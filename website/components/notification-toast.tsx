"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, MessageSquare, Heart, TrendingUp, Bell } from "lucide-react"

interface NotificationToastProps {
  notification: {
    id: string
    message: string
    type: string
    timestamp: string
    username?: string
  }
  onDismiss: (id: string) => void
}

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto dismiss after 6 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onDismiss(notification.id), 300)
    }, 6000)

    return () => clearTimeout(timer)
  }, [notification.id, onDismiss])

  const getIcon = () => {
    switch (notification.type) {
      case "new_question":
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case "new_answer":
        return <Heart className="w-5 h-5 text-green-600" />
      case "trending":
        return <TrendingUp className="w-5 h-5 text-orange-600" />
      default:
        return <Bell className="w-5 h-5 text-purple-600" />
    }
  }

  const getGradient = () => {
    switch (notification.type) {
      case "new_question":
        return "from-blue-500 to-indigo-600"
      case "new_answer":
        return "from-green-500 to-emerald-600"
      case "trending":
        return "from-orange-500 to-red-600"
      default:
        return "from-purple-500 to-pink-600"
    }
  }

  return (
    <Card
      className={`fixed top-20 right-4 z-50 w-96 shadow-2xl transition-all duration-500 transform border-0 overflow-hidden ${
        isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
      }`}
    >
      {/* Gradient top bar */}
      <div className={`h-1 bg-gradient-to-r ${getGradient()}`} />

      <CardContent className="p-4 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start space-x-3">
          {/* Icon with gradient background */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${getGradient()} flex items-center justify-center shadow-lg`}
          >
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">{notification.message}</p>
                <div className="flex items-center mt-2 space-x-2">
                  {notification.username && (
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                          {notification.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 font-medium">{notification.username}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsLeaving(true)
                  setTimeout(() => onDismiss(notification.id), 300)
                }}
                className="flex-shrink-0 p-1 h-6 w-6 hover:bg-gray-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getGradient()} animate-pulse`}
            style={{
              animation: "shrink 6s linear forwards",
            }}
          />
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </Card>
  )
}
