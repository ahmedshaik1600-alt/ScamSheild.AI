"use client"

import Link from "next/link"
import { Shield, ScanText, ImageIcon, BarChart3, History, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const tools = [
  {
    icon: ScanText,
    title: "Text Scam Detection",
    description: "Analyze SMS, WhatsApp, and email messages instantly with advanced AI algorithms",
    href: "/scan",
    features: ["Instant analysis", "Multi-language support", "Risk scoring", "Detailed reports"]
  },
  {
    icon: ImageIcon,
    title: "Screenshot OCR Upload",
    description: "Extract and analyze text from uploaded images using optical character recognition",
    href: "/scan/ocr",
    features: ["Image text extraction", "Multiple formats", "High accuracy", "Privacy-focused"]
  },
  {
    icon: BarChart3,
    title: "Smart Risk Scoring",
    description: "Get detailed risk percentages and threat levels with comprehensive analysis",
    href: "/dashboard/risk",
    features: ["Risk percentages", "Threat levels", "Pattern analysis", "Historical data"]
  },
  {
    icon: History,
    title: "Secure History",
    description: "Track and review all your previous scans with detailed timestamps and results",
    href: "/history",
    features: ["Scan history", "Search & filter", "Export data", "Secure storage"]
  }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="mb-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Shield className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Detection Tools
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful AI-powered tools designed to keep you safe from digital threats and scams
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {tools.map((tool) => (
              <div 
                key={tool.title}
                className="group rounded-2xl border border-border bg-card p-8 shadow-lg transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="inline-flex rounded-xl bg-secondary p-4">
                    <tool.icon className="h-8 w-8 text-foreground" />
                  </div>
                  <div className="rounded-full bg-success/10 px-3 py-1">
                    <span className="text-xs font-medium text-success">Active</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{tool.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {tool.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={tool.href}>
                  <Button size="lg" className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
                    Use This Tool
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="text-muted-foreground mb-8">
                Start with our Text Scam Detection tool for instant analysis, or explore all tools to find what works best for your needs.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/scan">
                  <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                    <ScanText className="h-5 w-5" />
                    Start with Text Analysis
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="border-border bg-transparent hover:bg-secondary">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
