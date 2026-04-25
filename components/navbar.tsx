"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Shield, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-border/50 transition-all duration-200 ${isScrolled ? 'bg-background/95 backdrop-blur-xl' : 'bg-background/80 backdrop-blur-xl'}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-foreground" />
            <span className="text-lg font-semibold tracking-tight">ScamShield</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link 
              href="/scan" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Scan
            </Link>
            <Link 
              href="/tools" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Tools
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link 
              href="/history" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              History
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Profile
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-border bg-transparent hover:bg-secondary">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/scan" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Scan
            </Link>
            <Link 
              href="/tools" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Tools
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/history" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="border-border bg-transparent hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-border bg-transparent hover:bg-secondary">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
