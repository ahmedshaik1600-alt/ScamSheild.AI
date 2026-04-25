import Link from "next/link"
import { Shield, ArrowLeft, CheckCircle, Users, Zap, Globe, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Analysis",
    description: "Get instant scam detection results in seconds with our advanced AI algorithms"
  },
  {
    icon: Shield,
    title: "Comprehensive Protection",
    description: "Detect SMS scams, phishing emails, fake job offers, and fraudulent messages"
  },
  {
    icon: Users,
    title: "User-Friendly Interface",
    description: "Simple and intuitive design that anyone can use to stay safe online"
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Analyze messages in multiple languages to protect diverse user communities"
  },
  {
    icon: CheckCircle,
    title: "Accurate Detection",
    description: "Advanced pattern recognition identifies sophisticated scam attempts"
  },
  {
    icon: Award,
    title: "Trusted by Thousands",
    description: "Join thousands of users who trust ScamShield for their digital safety"
  }
]

const stats = [
  { label: "Messages Analyzed", value: "100K+" },
  { label: "Scams Detected", value: "15K+" },
  { label: "Users Protected", value: "50K+" },
  { label: "Detection Rate", value: "98%" }
]

export default function AboutPage() {
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

          {/* Hero Section */}
          <div className="mb-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Shield className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              About ScamShield
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion in the digital world, protecting you from scams and fraudulent communications with cutting-edge AI technology.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="mb-16 rounded-xl border border-border bg-card p-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                In an era where digital scams are becoming increasingly sophisticated, we believe everyone deserves access to powerful protection tools. ScamShield was born from the need to make scam detection accessible, accurate, and instant for everyone. Our mission is to create a safer digital environment by empowering users with the knowledge and tools they need to identify and avoid fraudulent communications.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Why Choose ScamShield?</h2>
              <p className="mt-2 text-muted-foreground">
                Powerful features designed to keep you safe online
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-secondary p-3">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-16 rounded-xl border border-border bg-surface p-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-center">Advanced Technology</h2>
              <p className="text-muted-foreground text-center mb-6">
                Our AI-powered analysis engine uses cutting-edge machine learning algorithms trained on millions of scam patterns
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-center">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-medium mb-2">Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifies known scam patterns and red flags in real-time
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-medium mb-2">Contextual Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Understands context to reduce false positives and improve accuracy
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-medium mb-2">Continuous Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Evolves with new scam tactics and patterns
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-medium mb-2">Multi-Platform Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Works across SMS, WhatsApp, email, and messaging apps
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Ready to Stay Protected?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who trust ScamShield for their digital safety
              </p>
              <Link href="/scan">
                <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  Try ScamShield Now
                  <ArrowLeft className="h-4 w-4 rotate-180" />
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
