"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, Tag, FileText, Sparkles } from "lucide-react"
import Navigation from "@/components/navigation"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"

export default function AskQuestion() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
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
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
      }
    }

    checkUser()
  }, [router, supabase])

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const createNotificationForNewQuestion = (questionTitle: string, username: string) => {
    const notification = {
      id: Date.now().toString(),
      type: "new_question",
      message: `${username} asked: "${questionTitle}"`,
      timestamp: "just now",
      username: username,
    }

    // Trigger notification event
    window.dispatchEvent(new CustomEvent("newQuestionNotification", { detail: notification }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      if (isDemoMode) {
        const newQuestion = {
          id: Date.now().toString(),
          title,
          description,
          tags,
          votes: 0,
          views: 1,
          answers: 0,
          author_id: user.id,
          created_at: new Date().toISOString(),
          users: {
            username: user.user_metadata?.username || user.email.split("@")[0],
            full_name: user.user_metadata?.full_name || "Demo User",
          },
        }

        const existingQuestions = JSON.parse(localStorage.getItem("demo-questions") || "[]")
        const updatedQuestions = [newQuestion, ...existingQuestions]
        localStorage.setItem("demo-questions", JSON.stringify(updatedQuestions))

        // Create immediate notification
        createNotificationForNewQuestion(title, newQuestion.users.username)

        // Show success message
        alert("🎉 Question posted successfully! Check the home page for your new question.")
        router.push("/dashboard")
      } else {
        const { data, error } = await supabase
          .from("questions")
          .insert([
            {
              title,
              description,
              tags,
              author_id: user.id,
            },
          ])
          .select()

        if (error) throw error
        router.push("/dashboard")
      }
    } catch (error: any) {
      alert("Error creating question: " + error.message)
    } finally {
      setLoading(false)
    }
  }

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <Lightbulb className="h-10 w-10 text-yellow-500" />
            Ask a Question
          </h1>
          <p className="text-gray-600 text-lg">Share your question with our amazing community</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tips Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                  Tips for Great Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700">Be specific and clear in your title</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700">Provide context and what you've tried</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700">Use relevant tags to help others find your question</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-sm text-gray-700">Be respectful and follow community guidelines</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Your Question
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Question Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your question? Be specific and clear."
                      required
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
                    />
                    <p className="text-sm text-gray-500">
                      Make it clear and specific - this helps others understand your question quickly.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more details about your question. Include what you've tried and what you're looking for."
                      rows={8}
                      required
                      className="text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Include context, what you've tried, and what specific help you need.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label htmlFor="tags" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-green-500" />
                      Tags ({tags.length}/5)
                    </Label>
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="Add tags (press Enter or comma to add)"
                      disabled={tags.length >= 5}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag, index) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-2 text-sm flex items-center gap-2 animate-in slide-in-from-left duration-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Add up to 5 relevant tags to help others find your question.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Submit Question
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
