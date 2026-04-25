import Link from "next/link"
import { AlertTriangle, Shield, KeyRound, Landmark, Briefcase, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const sections = [
  {
    icon: AlertTriangle,
    title: "Warning Signs",
    description: "Learn to identify common red flags in scam messages",
    items: [
      "Urgency and pressure tactics",
      "Requests for personal information",
      "Too-good-to-be-true offers",
      "Poor grammar and spelling",
      "Suspicious links or attachments",
      "Unknown sender or spoofed identity"
    ]
  },
  {
    icon: CheckCircle,
    title: "Verify Messages",
    description: "Steps to verify the authenticity of suspicious communications",
    items: [
      "Contact the company directly using official numbers",
      "Check the sender's email domain carefully",
      "Hover over links before clicking",
      "Search for the message text online",
      "Ask friends or family for second opinions",
      "Use ScamShield to analyze suspicious text"
    ]
  },
  {
    icon: KeyRound,
    title: "Never Share OTP",
    description: "Your one-time passwords are keys to your accounts",
    items: [
      "Banks never ask for OTP via call or SMS",
      "OTPs are for your use only - never share them",
      "Legitimate services won't ask for your OTP",
      "Scammers pose as bank officials to steal OTPs",
      "Report anyone asking for your OTP immediately",
      "Enable authenticator apps when possible"
    ]
  },
  {
    icon: Landmark,
    title: "Safe Banking",
    description: "Protect yourself from financial fraud",
    items: [
      "Use official banking apps only",
      "Enable transaction notifications",
      "Verify beneficiary details before transfers",
      "Don't use public WiFi for banking",
      "Set transaction limits on your accounts",
      "Review statements regularly"
    ]
  },
  {
    icon: Briefcase,
    title: "Job Scam Alerts",
    description: "Identify and avoid fraudulent job offers",
    items: [
      "Real jobs don't require upfront payments",
      "Research the company thoroughly",
      "Be wary of work-from-home guarantees",
      "Verify job postings on official company sites",
      "Don't share sensitive documents early",
      "Trust your instincts if something feels off"
    ]
  }
]

const quickTips = [
  "When in doubt, don't click",
  "Verify before you trust",
  "Protect your personal info",
  "Report suspicious activity"
]

export default function AwarenessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Back Button */}
          <Link 
            href="/" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Stay Protected</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Scam Awareness Guide
            </h1>
            <p className="mt-4 text-muted-foreground">
              Essential knowledge to protect yourself from digital scams and fraud
            </p>
          </div>

          {/* Quick Tips */}
          <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickTips.map((tip, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-medium text-muted-foreground">
                  {index + 1}
                </div>
                <p className="text-sm font-medium">{tip}</p>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div 
                key={section.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-surface p-2.5">
                    <section.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{section.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-lg font-medium">Got a Suspicious Message?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use our AI-powered scanner to instantly analyze any message for scam indicators
              </p>
              <Link href="/scan">
                <Button className="mt-6 gap-2 bg-foreground text-background hover:bg-foreground/90">
                  Analyze Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
