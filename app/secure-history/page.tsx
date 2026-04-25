"use client"

import { useState } from "react"
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Key,
  Fingerprint,
  Server,
  FileKey,
  Database,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface HistoryEntry {
  id: string
  preview: string
  riskLevel: "safe" | "suspicious" | "high-risk" | "critical"
  riskScore: number
  date: string
  time: string
  type: string
}

const riskConfig = {
  "safe": { 
    label: "Safe", 
    color: "text-success", 
    bgColor: "bg-success/10",
    icon: CheckCircle 
  },
  "suspicious": { 
    label: "Suspicious", 
    color: "text-warning", 
    bgColor: "bg-warning/10",
    icon: AlertCircle 
  },
  "high-risk": { 
    label: "High Risk", 
    color: "text-danger", 
    bgColor: "bg-danger/10",
    icon: AlertTriangle 
  },
  "critical": { 
    label: "Critical", 
    color: "text-danger", 
    bgColor: "bg-danger/10",
    icon: XCircle 
  },
}

const securityLayers = [
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description: "Military-grade encryption protects every scan entry",
    detail: "Data encrypted at rest and in transit"
  },
  {
    icon: Key,
    title: "Zero-Knowledge Architecture",
    description: "Only you can decrypt your history",
    detail: "We never have access to your keys"
  },
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description: "Optional face or fingerprint unlock",
    detail: "Hardware-level security integration"
  },
  {
    icon: Server,
    title: "Isolated Storage",
    description: "Data stored in encrypted containers",
    detail: "Complete data isolation per user"
  },
]

const privacyFeatures = [
  {
    icon: RefreshCw,
    title: "Auto-Delete",
    description: "History automatically purged after 30 days"
  },
  {
    icon: FileKey,
    title: "Export Control",
    description: "Download your data anytime in encrypted format"
  },
  {
    icon: Database,
    title: "Local-First",
    description: "Data stays on device with optional cloud backup"
  },
]

const mockHistory: HistoryEntry[] = [
  {
    id: "1",
    preview: "Congratulations! You have won a prize of Rs. 50,000...",
    riskLevel: "critical",
    riskScore: 94,
    date: "Today",
    time: "2:30 PM",
    type: "SMS"
  },
  {
    id: "2",
    preview: "Your SBI account has been suspended. Click here to...",
    riskLevel: "high-risk",
    riskScore: 82,
    date: "Today",
    time: "11:15 AM",
    type: "SMS"
  },
  {
    id: "3",
    preview: "Your Amazon order #4829 has been shipped and will...",
    riskLevel: "safe",
    riskScore: 8,
    date: "Yesterday",
    time: "4:45 PM",
    type: "Email"
  },
  {
    id: "4",
    preview: "Urgent: Complete KYC verification within 24 hours or...",
    riskLevel: "suspicious",
    riskScore: 58,
    date: "Yesterday",
    time: "9:20 AM",
    type: "SMS"
  },
  {
    id: "5",
    preview: "Reminder: Your appointment is scheduled for tomorrow...",
    riskLevel: "safe",
    riskScore: 5,
    date: "2 days ago",
    time: "3:00 PM",
    type: "SMS"
  },
]

export default function SecureHistoryPage() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const filteredHistory = mockHistory.filter(entry => {
    if (selectedFilter === "all") return true
    return entry.riskLevel === selectedFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
              <ShieldCheck className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Secure History
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Your scan history is protected with end-to-end encryption, zero-knowledge architecture, and privacy-first design principles
            </p>
          </div>

          {/* Security Architecture Visual */}
          <div className="mx-auto mb-20 max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Security Architecture</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Four layers of protection for your data</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                  <Lock className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs font-medium text-success">Fully Encrypted</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {securityLayers.map((layer, index) => {
                  const Icon = layer.icon
                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-muted-foreground/30"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">
                          Layer {index + 1}
                        </span>
                      </div>
                      <h3 className="mb-1 font-medium">{layer.title}</h3>
                      <p className="text-sm text-muted-foreground">{layer.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground/70">{layer.detail}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* History Interface */}
        <section className="border-t border-border bg-surface py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Encrypted Scan History
              </h2>
              <p className="mt-3 text-muted-foreground">
                Access your protected history with complete privacy control
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card">
              {/* Header */}
              <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recent Scans</h3>
                    <p className="text-xs text-muted-foreground">{mockHistory.length} encrypted entries</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsRevealed(!isRevealed)}
                    className="gap-2 border-border bg-transparent hover:bg-secondary"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span className="hidden sm:inline">Hide Content</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Reveal Content</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-border bg-transparent hover:bg-secondary"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search encrypted history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "safe", "suspicious", "high-risk", "critical"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                        selectedFilter === filter
                          ? "bg-foreground text-background"
                          : "bg-surface text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {filter === "all" ? "All" : filter.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* History List */}
              <div className="divide-y divide-border">
                {filteredHistory.map((entry) => {
                  const config = riskConfig[entry.riskLevel]
                  const Icon = config.icon
                  
                  return (
                    <div 
                      key={entry.id}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-surface"
                    >
                      {/* Risk Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {isRevealed ? entry.preview : "••••••••••••••••••••••••••••••••••••••"}
                          </p>
                          {!isRevealed && (
                            <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{entry.date}, {entry.time}</span>
                          <span className="rounded bg-surface px-1.5 py-0.5">{entry.type}</span>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                          <span className={`block text-sm font-medium ${config.color}`}>
                            {entry.riskScore}%
                          </span>
                          <span className="text-xs text-muted-foreground">risk</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Auto-delete in 30 days</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-danger/30 bg-transparent text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Features */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Privacy by Design
              </h2>
              <p className="mt-3 text-muted-foreground">
                Built from the ground up to protect your sensitive data
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {privacyFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-surface"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface transition-colors group-hover:bg-secondary">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="mb-2 font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <section className="border-t border-border bg-surface py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-success/20 bg-success/5 p-8 sm:flex-row">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-success/10">
                <Shield className="h-7 w-7 text-success" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-medium">Your Privacy is Our Priority</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We never share, sell, or analyze your scan history. All data remains encrypted with keys only you control. We physically cannot access your data even if compelled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Start Building Your Secure History
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every scan is automatically encrypted and stored securely
            </p>
            <div className="mt-8">
              <Link href="/scan">
                <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  Scan Your First Message
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
