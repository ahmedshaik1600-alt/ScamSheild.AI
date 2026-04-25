"use client"

import { useState } from "react"
import { 
  Shield, 
  TrendingUp, 
  Brain,
  Activity,
  Gauge,
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Sparkles,
  BarChart3,
  Target,
  Layers,
  Zap,
  Eye,
  Globe,
  ArrowRight,
  Clock,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

const riskLevels = [
  {
    range: "0-20",
    level: "Safe",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    icon: CheckCircle,
    description: "No threat indicators detected. Message appears legitimate.",
    action: "Safe to proceed"
  },
  {
    range: "21-45",
    level: "Low Risk",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    icon: CheckCircle,
    description: "Minor anomalies detected but likely safe.",
    action: "Verify sender if unsure"
  },
  {
    range: "46-65",
    level: "Moderate",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    icon: AlertCircle,
    description: "Multiple warning signs present.",
    action: "Exercise caution"
  },
  {
    range: "66-85",
    level: "High Risk",
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
    icon: AlertTriangle,
    description: "Strong scam indicators identified.",
    action: "Do not engage"
  },
  {
    range: "86-100",
    level: "Critical",
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
    icon: XCircle,
    description: "Confirmed scam patterns matched.",
    action: "Delete immediately"
  },
]

const analysisFactors = [
  {
    icon: Layers,
    title: "Linguistic Analysis",
    weight: 30,
    metrics: ["Urgency indicators", "Pressure language", "Grammar anomalies", "Tone manipulation"],
    description: "AI analyzes text patterns, emotional manipulation tactics, and linguistic red flags"
  },
  {
    icon: Globe,
    title: "URL Intelligence",
    weight: 25,
    metrics: ["Domain reputation", "SSL certificate", "Redirect chains", "Typosquatting"],
    description: "Deep inspection of embedded links against threat databases and domain analysis"
  },
  {
    icon: Target,
    title: "Pattern Recognition",
    weight: 25,
    metrics: ["Known templates", "Phishing signatures", "Scam variations", "Historical matches"],
    description: "Machine learning models trained on millions of confirmed scam messages"
  },
  {
    icon: Zap,
    title: "Behavioral Signals",
    weight: 20,
    metrics: ["OTP requests", "Personal data asks", "Financial prompts", "Credential harvesting"],
    description: "Detection of social engineering tactics and sensitive data extraction attempts"
  },
]

const predictiveFeatures = [
  {
    icon: Brain,
    title: "Predictive Threat Modeling",
    description: "AI predicts emerging scam patterns before they become widespread"
  },
  {
    icon: Activity,
    title: "Real-Time Analysis",
    description: "Instant risk assessment with sub-second response times"
  },
  {
    icon: RefreshCw,
    title: "Adaptive Learning",
    description: "System evolves with new threat data every 24 hours"
  },
  {
    icon: Eye,
    title: "Contextual Understanding",
    description: "Analyzes message context, not just keywords"
  },
]

export default function RiskScoringPage() {
  const [activeLevel, setActiveLevel] = useState<number>(2)
  const [hoveredFactor, setHoveredFactor] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
              <Gauge className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Smart Risk Scoring
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Advanced AI-powered threat assessment with real-time analysis and predictive insights to protect you from evolving scam tactics
            </p>
          </div>

          {/* Live Score Demo */}
          <div className="mx-auto mb-20 max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-medium">Live Risk Assessment</h2>
                <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                  <span className="text-xs text-success">Real-time</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                {/* Animated Score Ring */}
                <div className="relative mb-6">
                  <svg className="h-48 w-48 -rotate-90" viewBox="0 0 200 200">
                    {/* Background ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-secondary"
                    />
                    {/* Progress ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(riskLevels[activeLevel].range.split('-')[1] as unknown as number) * 5.34} 534`}
                      strokeLinecap="round"
                      className={activeLevel <= 1 ? "text-success" : activeLevel === 2 ? "text-warning" : "text-danger"}
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-semibold ${riskLevels[activeLevel].color}`}>
                      {riskLevels[activeLevel].range.split('-')[1]}
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground">Risk Score</span>
                  </div>
                </div>

                {/* Risk Level Indicator */}
                <div className={`mb-6 flex items-center gap-2 rounded-full px-4 py-2 ${riskLevels[activeLevel].bgColor}`}>
                  {(() => {
                    const Icon = riskLevels[activeLevel].icon
                    return <Icon className={`h-5 w-5 ${riskLevels[activeLevel].color}`} />
                  })()}
                  <span className={`font-medium ${riskLevels[activeLevel].color}`}>
                    {riskLevels[activeLevel].level}
                  </span>
                </div>

                {/* Risk Level Selector */}
                <div className="flex w-full max-w-md gap-1">
                  {riskLevels.map((level, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveLevel(index)}
                      className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                        activeLevel === index
                          ? `${level.bgColor} ${level.color}`
                          : "bg-surface text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {level.range}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">{riskLevels[activeLevel].description}</p>
                  <p className={`mt-2 text-sm font-medium ${riskLevels[activeLevel].color}`}>
                    Recommended: {riskLevels[activeLevel].action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Factors */}
        <section className="border-t border-border bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Multi-Factor Analysis Engine
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four intelligent layers work together to provide comprehensive threat assessment
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {analysisFactors.map((factor, index) => {
                const Icon = factor.icon
                const isHovered = hoveredFactor === index
                
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredFactor(index)}
                    onMouseLeave={() => setHoveredFactor(null)}
                    className={`rounded-xl border p-6 transition-all ${
                      isHovered 
                        ? "border-muted-foreground/50 bg-card" 
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{factor.title}</h3>
                          <p className="text-xs text-muted-foreground">{factor.weight}% of total score</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-semibold">{factor.weight}</span>
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>

                    {/* Weight Bar */}
                    <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div 
                        className="h-full rounded-full bg-foreground transition-all duration-500"
                        style={{ width: isHovered ? `${factor.weight}%` : "0%" }}
                      />
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">{factor.description}</p>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2">
                      {factor.metrics.map((metric, idx) => (
                        <span 
                          key={idx}
                          className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Predictive Features */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-foreground" />
                <span className="text-sm">Advanced Capabilities</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Predictive Intelligence
              </h2>
              <p className="mt-3 text-muted-foreground">
                Stay ahead of threats with AI that anticipates and adapts
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {predictiveFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group rounded-xl border border-border bg-card p-5 transition-colors hover:bg-surface"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-secondary">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="mb-2 font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-border bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <p className="text-4xl font-semibold">99.7%</p>
                <p className="mt-2 text-sm text-muted-foreground">Detection Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-semibold">&lt;200ms</p>
                <p className="mt-2 text-sm text-muted-foreground">Analysis Speed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-semibold">50M+</p>
                <p className="mt-2 text-sm text-muted-foreground">Patterns Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-semibold">24h</p>
                <p className="mt-2 text-sm text-muted-foreground">Model Updates</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Experience Smart Risk Scoring
            </h2>
            <p className="mt-3 text-muted-foreground">
              Paste any suspicious message and get instant AI-powered threat analysis
            </p>
            <div className="mt-8">
              <Link href="/scan">
                <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  Analyze a Message
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
