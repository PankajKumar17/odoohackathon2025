"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
        setProfile({
          username: mockUser.user_metadata?.username || mockUser.email.split("@")[0],
          full_name: mockUser.user_metadata?.full_name || "Demo User",
          email: mockUser.email,
          created_at: new Date().toISOString(),
        })
        setQuestions([])
        setAnswers([])
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
        fetchProfile(user.id)
        fetchUserQuestions(user.id)
        fetchUserAnswers(user.id)
      }
    }

    checkUser()
  }, [router, supabase])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserQuestions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error("Error fetching questions:", error)
    }
  }

  const fetchUserAnswers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select(`
          *,
          questions (title)
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAnswers(data || [])
    } catch (error) {
      console.error("Error fetching answers:", error)
    }
  }

  if (!user || loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Username:</strong> {profile?.username}
              </p>
              <p>
                <strong>Full Name:</strong> {profile?.full_name}
              </p>
              <p>
                <strong>Email:</strong> {profile?.email}
              </p>
              <p>
                <strong>Member since:</strong> {formatDistanceToNow(new Date(profile?.created_at), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-gray-500">You haven't asked any questions yet.</p>
              ) : (
                <div className="space-y-4">
                  {questions.slice(0, 5).map((question) => (
                    <div key={question.id} className="border-b pb-2">
                      <h4 className="font-medium text-sm">{question.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {question.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Answers ({answers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {answers.length === 0 ? (
                <p className="text-gray-500">You haven't answered any questions yet.</p>
              ) : (
                <div className="space-y-4">
                  {answers.slice(0, 5).map((answer) => (
                    <div key={answer.id} className="border-b pb-2">
                      <h4 className="font-medium text-sm">{answer.questions.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{answer.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
