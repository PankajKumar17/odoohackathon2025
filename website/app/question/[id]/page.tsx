"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import AnswerCard from "@/components/answer-card"
import VoteButtons from "@/components/vote-buttons"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface QuestionDetailProps {
  params: {
    id: string
  }
}

export default function QuestionDetail({ params }: QuestionDetailProps) {
  const [question, setQuestion] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [newAnswer, setNewAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
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
        setQuestion(getMockQuestion())
        setAnswers(getMockAnswers())
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
        fetchQuestion()
        fetchAnswers()
      }
    }

    checkUser()
  }, [params.id, router, supabase])

  const getMockQuestion = () => ({
    id: params.id,
    title: "How to learn React effectively?",
    description:
      "I am new to React and want to know the best practices and resources to learn it quickly and effectively. I have some experience with JavaScript but React seems quite different.",
    tags: ["react", "javascript", "learning"],
    votes: 5,
    created_at: new Date().toISOString(),
    users: { username: "john_doe", full_name: "John Doe" },
  })

  const getMockAnswers = () => {
    // Load answers from localStorage if available
    const storedAnswers = localStorage.getItem(`demo-answers-${params.id}`)
    if (storedAnswers) {
      return JSON.parse(storedAnswers)
    }

    // Default answers
    const defaultAnswers = [
      {
        id: "1",
        content:
          "Start with the official React documentation and build small projects. Practice is key! I recommend starting with create-react-app and building a todo list, then move on to more complex projects.",
        votes: 3,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        users: { username: "jane_smith", full_name: "Jane Smith" },
      },
      {
        id: "2",
        content:
          "I found that understanding JavaScript fundamentals first is crucial. Make sure you are comfortable with ES6 features like arrow functions, destructuring, and modules before diving deep into React.",
        votes: 1,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        users: { username: "bob_wilson", full_name: "Bob Wilson" },
      },
    ]

    return defaultAnswers
  }

  const fetchQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          users (username, full_name)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setQuestion(data)
    } catch (error) {
      console.error("Error fetching question:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select(`
          *,
          users (username, full_name)
        `)
        .eq("question_id", params.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setAnswers(data || [])
    } catch (error) {
      console.error("Error fetching answers:", error)
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newAnswer.trim()) return

    setSubmitting(true)
    try {
      if (isDemoMode) {
        // Demo mode - add answer to localStorage
        const newMockAnswer = {
          id: Date.now().toString(),
          content: newAnswer,
          votes: 0,
          created_at: new Date().toISOString(),
          users: { username: user.user_metadata?.username || "demo_user", full_name: "Demo User" },
        }

        // Store answer in localStorage
        const existingAnswers = JSON.parse(localStorage.getItem(`demo-answers-${params.id}`) || "[]")
        const updatedAnswers = [...existingAnswers, newMockAnswer]
        localStorage.setItem(`demo-answers-${params.id}`, JSON.stringify(updatedAnswers))

        setAnswers([...answers, newMockAnswer])
        setNewAnswer("")
      } else {
        const { error } = await supabase.from("answers").insert([
          {
            content: newAnswer,
            question_id: params.id,
            author_id: user.id,
          },
        ])

        if (error) throw error
        setNewAnswer("")
        fetchAnswers()
      }
    } catch (error: any) {
      alert("Error submitting answer: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user || loading) {
    return <div>Loading...</div>
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Question not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <div className="flex">
            <div className="p-4 border-r">
              <VoteButtons itemId={question.id} itemType="question" initialVotes={question.votes || 0} />
            </div>
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-2xl">{question.title}</CardTitle>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Asked by {question.users.username}</span>
                  <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{question.description}</p>

                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {answers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No answers yet. Be the first to answer!</div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Share your knowledge and help others..."
                rows={6}
                required
              />

              <Button type="submit" disabled={submitting || !newAnswer.trim()}>
                {submitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
