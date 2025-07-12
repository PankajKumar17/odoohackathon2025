import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Eye, Clock, TrendingUp } from "lucide-react"
import VoteButtons from "@/components/vote-buttons"

interface QuestionCardProps {
  question: {
    id: string
    title: string
    description: string
    tags: string[]
    created_at: string
    votes?: number
    views?: number
    answers?: number
    users: {
      username: string
      full_name: string
    }
  }
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 overflow-hidden">
      <div className="flex">
        {/* Vote Section */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
          <VoteButtons itemId={question.id} itemType="question" initialVotes={question.votes || 0} />
        </div>

        {/* Content Section */}
        <div className="flex-1 relative">
          {/* Trending Indicator */}
          {(question.votes || 0) > 5 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
              <TrendingUp className="h-3 w-3" />
              Hot
            </div>
          )}

          <CardHeader className="pb-3">
            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-200">
              <Link href={`/question/${question.id}`} className="hover:underline">
                {question.title}
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600 line-clamp-2 leading-relaxed">{question.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{question.answers || 0} answers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views || Math.floor(Math.random() * 100)} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-semibold">
                    {question.users.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{question.users.username}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
