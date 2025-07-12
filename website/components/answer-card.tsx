import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Award, CheckCircle } from "lucide-react"
import VoteButtons from "@/components/vote-buttons"

interface AnswerCardProps {
  answer: {
    id: string
    content: string
    created_at: string
    votes?: number
    isAccepted?: boolean
    users: {
      username: string
      full_name: string
    }
  }
}

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <Card
      className={`mb-6 transition-all duration-300 hover:shadow-lg border-l-4 ${
        answer.isAccepted
          ? "border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
          : "border-l-blue-500 bg-gradient-to-r from-white to-gray-50"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold">
                {answer.users.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{answer.users.username}</span>
                {answer.isAccepted && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Accepted
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {Math.floor(Math.random() * 1000)} rep
                </Badge>
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none mb-4">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer.content}</p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Helpful
            </Badge>
          </div>
          <VoteButtons itemId={answer.id} itemType="answer" initialVotes={answer.votes || 0} />
        </div>
      </CardContent>
    </Card>
  )
}
