"use client"

import Link from "next/link"
import { Shield, ScanText, ImageIcon, BarChart3, History, ArrowRight, CheckCircle, AlertTriangle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"

const tools = [
  {
    icon: ScanText,
    title: "Text Scam Detection",
    description: "Analyze SMS, WhatsApp, and email messages instantly",
    href: "/scan"
  },
  {
    icon: ImageIcon,
    title: "Screenshot OCR Upload",
    description: "Extract and analyze text from uploaded images",
    href: "/scan/ocr"
  },
  {
    icon: BarChart3,
    title: "Smart Risk Scoring",
    description: "Get detailed risk percentages and threat levels",
    href: "/dashboard/risk"
  },
  {
    icon: History,
    title: "Secure History",
    description: "Track and review all your previous scans",
    href: "/history"
  }
]

const steps = [
  { number: "01", title: "Paste Text", description: "Copy suspicious message" },
  { number: "02", title: "Analyze", description: "AI-powered detection" },
  { number: "03", title: "Review Result", description: "See risk breakdown" },
  { number: "04", title: "Stay Safe", description: "Take recommended action" }
]

const valueCards = [
  {
    icon: Shield,
    title: "Detect fake bank alerts",
    description: "Identify fraudulent banking communications"
  },
  {
    icon: AlertTriangle,
    title: "Spot phishing links",
    description: "Catch malicious website attempts"
  },
  {
    icon: CheckCircle,
    title: "Catch OTP scams",
    description: "Protect your one-time passwords"
  },
  {
    icon: BarChart3,
    title: "Identify fake job offers",
    description: "Recognize employment fraud"
  }
]

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Detect Scam Messages
              <span className="block text-foreground">Before They Cost You</span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Analyze suspicious SMS, WhatsApp, and emails instantly using ScamShield's advanced AI technology.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-4">
              <Link href="/scan">
                <Button size="lg" className="gap-3 bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6 h-auto">
                  <ScanText className="h-5 w-5" />
                  Scan a Message Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#tools">
                <Button variant="outline" size="lg" className="border-border bg-transparent hover:bg-secondary text-lg px-8 py-6 h-auto">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-semibold">Try Live Scanner</h3>
              <div className="mb-6 rounded-xl bg-surface p-6">
                <textarea 
                  placeholder="Paste suspicious message here..."
                  className="w-full h-32 resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
              </div>
              <Button size="lg" className="w-full gap-3 bg-foreground text-background hover:bg-foreground/90 text-lg py-6">
                <ScanText className="h-5 w-5" />
                Analyze Now
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-semibold">Real-time Protection</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-success/10 p-2">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Privacy-first</p>
                    <p className="text-sm text-muted-foreground">Your data never leaves your device</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-warning/10 p-2">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Lightning Fast</p>
                    <p className="text-sm text-muted-foreground">Get results in under 2 seconds</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-info/10 p-2">
                    <Shield className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">AI-Powered</p>
                    <p className="text-sm text-muted-foreground">Advanced threat detection algorithms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ScamShield Section */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why ScamShield
            </h2>
            <p className="mt-4 text-muted-foreground">
              Advanced protection with privacy-first design and real-time threat analysis
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((card, index) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <card.icon className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">{card.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful Detection Tools
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Advanced AI-powered tools to keep you safe from digital threats
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.title}>
                <div 
                  className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                >
                  <div className="mb-6 inline-flex rounded-xl bg-secondary p-4">
                    <tool.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{tool.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four simple steps to analyze any suspicious message
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                    <span className="text-sm font-medium text-muted-foreground">{step.number}</span>
                  </div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border lg:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/scan">
              <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Stay Safe Online
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands who trust ScamShield for their digital security
            </p>
          </div>

          <div className="text-center">
            <Link href="/scan">
              <Button size="lg" className="gap-2">
                Start Free Scan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
