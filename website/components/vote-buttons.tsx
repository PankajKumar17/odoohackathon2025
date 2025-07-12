"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Heart, HeartOff } from "lucide-react"
import { getSupabaseClient, isDemoMode, getMockUser } from "@/lib/supabase"

interface VoteButtonsProps {
  itemId: string
  itemType: "question" | "answer"
  initialVotes?: number
  onVoteChange?: (newVotes: number) => void
}

export default function VoteButtons({ itemId, itemType, initialVotes = 0, onVoteChange }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Load user's previous vote from localStorage in demo mode
    if (isDemoMode) {
      const user = getMockUser()
      if (user) {
        const storedVote = localStorage.getItem(`vote-${itemType}-${itemId}-${user.id}`)
        if (storedVote) {
          setUserVote(storedVote as "up" | "down")
        }
      }

      // Load vote count from localStorage
      const storedVotes = localStorage.getItem(`votes-${itemType}-${itemId}`)
      if (storedVotes) {
        setVotes(Number.parseInt(storedVotes))
      }
    }
  }, [itemId, itemType])

  const handleVote = async (voteType: "up" | "down") => {
    if (loading) return

    setLoading(true)
    try {
      if (isDemoMode) {
        const user = getMockUser()
        if (!user) return

        let newVotes = votes
        let newUserVote: "up" | "down" | null = voteType

        // If user already voted the same way, remove the vote
        if (userVote === voteType) {
          newVotes = voteType === "up" ? votes - 1 : votes + 1
          newUserVote = null
          localStorage.removeItem(`vote-${itemType}-${itemId}-${user.id}`)
        }
        // If user voted differently, change the vote
        else if (userVote) {
          newVotes = voteType === "up" ? votes + 2 : votes - 2
          localStorage.setItem(`vote-${itemType}-${itemId}-${user.id}`, voteType)
        }
        // If user hasn't voted, add the vote
        else {
          newVotes = voteType === "up" ? votes + 1 : votes - 1
          localStorage.setItem(`vote-${itemType}-${itemId}-${user.id}`, voteType)
        }

        setVotes(newVotes)
        setUserVote(newUserVote)
        localStorage.setItem(`votes-${itemType}-${itemId}`, newVotes.toString())
        onVoteChange?.(newVotes)
      } else {
        // Real Supabase implementation would go here
        console.log("Supabase voting not implemented yet")
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setLoading(false)
    }
  }

  if (itemType === "question") {
    return (
      <div className="flex flex-col items-center space-y-1">
        <Button
          variant={userVote === "up" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleVote("up")}
          disabled={loading}
          className="p-1 h-8 w-8"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700">{votes}</span>
        <Button
          variant={userVote === "down" ? "destructive" : "ghost"}
          size="sm"
          onClick={() => handleVote("down")}
          disabled={loading}
          className="p-1 h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // For answers, use like/dislike
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userVote === "up" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleVote("up")}
        disabled={loading}
        className="flex items-center space-x-1"
      >
        <Heart className={`h-4 w-4 ${userVote === "up" ? "fill-current" : ""}`} />
        <span>{votes > 0 ? votes : ""}</span>
      </Button>
      <Button
        variant={userVote === "down" ? "destructive" : "ghost"}
        size="sm"
        onClick={() => handleVote("down")}
        disabled={loading}
        className="flex items-center space-x-1"
      >
        <HeartOff className="h-4 w-4" />
      </Button>
    </div>
  )
}
