"use client"

import Link from "next/link"
import { ArrowLeft, BarChart3, AlertTriangle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RiskScoringPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Back Button */}
          <Link 
            href="/dashboard" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Smart Risk Scoring
            </h1>
            <p className="mt-4 text-muted-foreground">
              Advanced AI-powered risk assessment with detailed threat analysis
            </p>
          </div>

          {/* Risk Scoring Features */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Score Algorithm</span>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Multi-Factor Analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Combines pattern matching, AI analysis, and behavioral indicators for comprehensive scoring
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threat Levels</span>
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium">5-Tier Classification</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Safe, Suspicious, High-Risk, Likely-Scam with confidence percentages
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Real-time Analysis</span>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Live Threat Intelligence</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Continuous monitoring of emerging scam patterns and threats
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/scan">
              <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                Try Risk Scoring
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
