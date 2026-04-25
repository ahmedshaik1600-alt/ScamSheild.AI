"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { auth } from "@/lib/storage"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking auth state:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const unsubscribe = auth.onAuthChange((user) => {
      setUser(user)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const user = await auth.signIn(email, password)
      setUser(user)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const user = await auth.signUp(email, password, name)
      setUser(user)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up')
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access this page</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90"
            >
              Sign In
            </button>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
