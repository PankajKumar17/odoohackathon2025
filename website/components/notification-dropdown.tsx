"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, MessageSquare, Heart, TrendingUp, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "answer":
        return <Heart className="h-4 w-4 text-green-600" />
      case "question":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "trending":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-purple-600" />
    }
  }

  const getGradient = (type: string) => {
    switch (type) {
      case "answer":
        return "from-green-100 to-emerald-100"
      case "question":
        return "from-blue-100 to-indigo-100"
      case "trending":
        return "from-orange-100 to-red-100"
      default:
        return "from-purple-100 to-pink-100"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative hover:bg-gray-100 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-blue-600" : "text-gray-600"}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-full mt-2 w-96 z-20 max-h-96 overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">{unreadCount} new</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      className="text-xs hover:bg-white/50 flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="hover:bg-white/50">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-gray-400 text-sm">We'll notify you when something happens!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        !notification.read ? `bg-gradient-to-r ${getGradient(notification.type)}` : ""
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${getGradient(notification.type)} flex items-center justify-center shadow-sm`}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium leading-relaxed">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
