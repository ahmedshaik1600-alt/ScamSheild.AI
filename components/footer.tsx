import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-foreground" />
            <span className="text-sm font-medium">ScamShield</span>
          </div>
          
          <div className="flex items-center gap-8">
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
          </div>
          
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ScamShield
          </p>
        </div>
      </div>
    </footer>
  )
}
