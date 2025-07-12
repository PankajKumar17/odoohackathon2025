import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Stack<span className="text-blue-600">It</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A community-driven platform where curious minds ask questions and share knowledge. Join thousands of
            learners and experts in meaningful discussions.
          </p>

          <div className="space-y-4">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/login">Get Started - Login</Link>
            </Button>

            <div className="text-sm text-gray-500">Join our community of knowledge seekers and sharers</div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">❓</div>
            <h3 className="text-lg font-semibold mb-2">Ask Questions</h3>
            <p className="text-gray-600">Get answers from experts and community members</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">💡</div>
            <h3 className="text-lg font-semibold mb-2">Share Knowledge</h3>
            <p className="text-gray-600">Help others by sharing your expertise and insights</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-lg font-semibold mb-2">Build Community</h3>
            <p className="text-gray-600">Connect with like-minded individuals and grow together</p>
          </div>
        </div>
      </div>
    </div>
  )
}
