"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      await signUp(email, password, name)
      
      toast({
        title: "Account Created!",
        description: "Welcome to ScamShield! Please check your email to verify your account.",
      })
      
      // Redirect to login after successful signup
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      
    } catch (err: any) {
      toast({
        title: "Sign Up Failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-foreground" />
            <span className="text-xl font-semibold tracking-tight">ScamShield</span>
          </Link>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-semibold">Create an account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started with ScamShield
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Sign In */}
            <Button 
              variant="outline" 
              className="w-full gap-2 border-border bg-transparent hover:bg-secondary"
              disabled
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <button className="text-foreground hover:underline">Terms of Service</button>
              {" "}and{" "}
              <button className="text-foreground hover:underline">Privacy Policy</button>
            </p>

            {/* Sign In Link */}
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <Link 
            href="/" 
            className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
