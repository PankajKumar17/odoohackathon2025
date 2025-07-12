import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for demo purposes when env vars are not available
const createMockClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async ({ email, password }: any) => {
      // Mock authentication - in real app, this would be handled by Supabase
      const mockUser = {
        id: "mock-user-id",
        email,
        user_metadata: { username: email.split("@")[0] },
      }
      localStorage.setItem("mock-user", JSON.stringify(mockUser))
      return { data: { user: mockUser }, error: null }
    },
    signUp: async ({ email, password }: any) => {
      const mockUser = {
        id: "mock-user-" + Date.now(),
        email,
        user_metadata: { username: email.split("@")[0] },
      }
      localStorage.setItem("mock-user", JSON.stringify(mockUser))
      return { data: { user: mockUser }, error: null }
    },
    signOut: async () => {
      localStorage.removeItem("mock-user")
      return { error: null }
    },
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: { message: "Demo mode - Supabase not configured" } }),
        order: (column: string, options?: any) => ({
          then: async () => ({ data: [], error: null }),
        }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      then: async () => ({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => Promise.resolve({ data: null, error: { message: "Demo mode - Supabase not configured" } }),
      then: async () => ({ data: null, error: { message: "Demo mode - Supabase not configured" } }),
    }),
  }),
})

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()

// Client-side singleton
let supabaseClient: any = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockClient()
  }
  return supabaseClient
}

// Helper function to check if we're in demo mode
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

// Mock data for demo
export const getMockUser = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mock-user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}
