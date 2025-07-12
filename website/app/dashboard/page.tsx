"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, TrendingUp, MessageSquare, Users, Sparkles } from "lucide-react"
import Navigation from "@/components/navigation"
import QuestionCard from "@/components/question-card"
import NotificationToast from "@/components/notification-toast"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"

export default function Dashboard() {
  const [questions, setQuestions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [toastNotifications, setToastNotifications] = useState<any[]>([])
  const [stats, setStats] = useState({ totalQuestions: 0, totalAnswers: 0, totalUsers: 0 })
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      if (isDemoMode) {
        const mockUser = getMockUser()
        if (!mockUser) {
          router.push("/login")
          return
        }
        setUser(mockUser)
        const mockQuestions = getMockQuestions()
        setQuestions(mockQuestions)
        setStats({
          totalQuestions: mockQuestions.length,
          totalAnswers: 15,
          totalUsers: 1250,
        })
        setLoading(false)
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
        fetchQuestions()
      }
    }

    checkUser()
  }, [router, supabase])

  useEffect(() => {
    // Listen for new question notifications
    const handleNewQuestionNotification = (event: any) => {
      const notification = event.detail
      setToastNotifications((prev) => [notification, ...prev])
    }

    // Listen for new answer notifications
    const handleNewAnswerNotification = (event: any) => {
      const notification = event.detail
      setToastNotifications((prev) => [notification, ...prev])
    }

    window.addEventListener("newQuestionNotification", handleNewQuestionNotification)
    window.addEventListener("newAnswerNotification", handleNewAnswerNotification)

    return () => {
      window.removeEventListener("newQuestionNotification", handleNewQuestionNotification)
      window.removeEventListener("newAnswerNotification", handleNewAnswerNotification)
    }
  }, [])

  const getMockQuestions = () => {
    const storedQuestions = localStorage.getItem("demo-questions")
    if (storedQuestions) {
      return JSON.parse(storedQuestions)
    }

    const defaultQuestions = [
      {
        id: "1",
        title: "How to learn React effectively in 2024?",
        description:
          "I am new to React and want to know the best practices and resources to learn it quickly and effectively. What are the most important concepts to focus on first?",
        tags: ["react", "javascript", "learning", "frontend"],
        votes: 12,
        views: 234,
        answers: 8,
        created_at: new Date().toISOString(),
        users: { username: "john_doe", full_name: "John Doe" },
      },
      {
        id: "2",
        title: "Best practices for database design and optimization?",
        description:
          "What are the key principles I should follow when designing a relational database schema? Looking for performance optimization tips.",
        tags: ["database", "sql", "design", "performance"],
        votes: 8,
        views: 156,
        answers: 5,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        users: { username: "jane_smith", full_name: "Jane Smith" },
      },
      {
        id: "3",
        title: "How to optimize website performance and loading speed?",
        description:
          "My website is loading slowly and I need to improve the user experience. What are the most effective ways to optimize performance?",
        tags: ["performance", "web", "optimization", "seo"],
        votes: 15,
        views: 342,
        answers: 12,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        users: { username: "bob_wilson", full_name: "Bob Wilson" },
      },
    ]

    localStorage.setItem("demo-questions", JSON.stringify(defaultQuestions))
    return defaultQuestions
  }

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`
        *,
        users (username, full_name)
      `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error("Error fetching questions:", error)
      setQuestions(getMockQuestions())
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDismissToast = (notificationId: string) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  useEffect(() => {
    const handleFocus = () => {
      if (isDemoMode && user) {
        setQuestions(getMockQuestions())
      } else if (user) {
        fetchQuestions()
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {toastNotifications.map((notification) => (
          <NotificationToast key={notification.id} notification={notification} onDismiss={handleDismissToast} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user.user_metadata?.username || user.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Discover, learn, and share knowledge with our community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Questions</p>
                  <p className="text-3xl font-bold">{stats.totalQuestions}</p>
                </div>
                <MessageSquare className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Answers</p>
                  <p className="text-3xl font-bold">{stats.totalAnswers}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Community Members</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Ask Question */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search questions, answers, and tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-0 shadow-lg bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200"
            />
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8"
          >
            <Link href="/ask-question" className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Ask Question</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Popular Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["react", "javascript", "python", "database", "web-development", "api", "css", "node.js"].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 cursor-pointer transition-all duration-200 px-4 py-2"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Recent Questions
            </h2>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {filteredQuestions.length} questions
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="text-center py-12 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
              <CardContent>
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No questions found" : "No questions yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Be the first to ask a question!"}
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link href="/ask-question">Ask the First Question</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
