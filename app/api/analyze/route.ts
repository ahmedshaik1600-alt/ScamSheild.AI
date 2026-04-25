import { NextRequest, NextResponse } from 'next/server'

type RiskLevel = "safe" | "suspicious" | "high-risk" | "likely-scam" | null
type ScamType = "phishing" | "fake-job" | "loan-scam" | "bank-fraud" | "investment-scam" | "otp-theft" | "unknown" | null

interface AnalysisResult {
  riskLevel: RiskLevel
  riskScore: number
  scamType: ScamType
  redFlags: string[]
  recommendations: string[]
}

const riskConfig = {
  "safe": { 
    label: "Safe", 
    color: "text-success", 
    bgColor: "bg-success/10", 
    borderColor: "border-success/30",
    icon: "CheckCircle" 
  },
  "suspicious": { 
    label: "Suspicious", 
    color: "text-warning", 
    bgColor: "bg-warning/10", 
    borderColor: "border-warning/30",
    icon: "AlertCircle" 
  },
  "high-risk": { 
    label: "High Risk", 
    color: "text-danger", 
    bgColor: "bg-danger/10", 
    borderColor: "border-danger/30",
    icon: "AlertTriangle" 
  },
  "likely-scam": { 
    label: "Likely Scam", 
    color: "text-danger", 
    bgColor: "bg-danger/10", 
    borderColor: "border-danger/30",
    icon: "XCircle" 
  },
}

const scamTypeLabels: Record<string, string> = {
  "phishing": "Phishing",
  "fake-job": "Fake Job",
  "loan-scam": "Loan Scam",
  "bank-fraud": "Bank Fraud",
  "investment-scam": "Investment Scam",
  "otp-theft": "OTP Theft",
  "unknown": "Unknown",
}

// Analysis function
function analyzeText(text: string): AnalysisResult {
  const lowerText = text.toLowerCase()
  
  // Check for common scam indicators
  const urgencyWords = ["urgent", "immediately", "now", "hurry", "limited time", "act fast", "expire"]
  const moneyWords = ["prize", "won", "lottery", "bank", "account", "transfer", "payment", "loan"]
  const suspiciousWords = ["click here", "verify", "confirm", "update", "suspended", "unusual activity"]
  const jobWords = ["work from home", "easy money", "guaranteed income", "no experience"]
  const otpWords = ["otp", "code", "pin", "password", "verify your"]
  
  let score = 0
  const flags: string[] = []
  
  urgencyWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 15
      flags.push(`Contains urgency language: "${word}"`)
    }
  })
  
  moneyWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 10
      flags.push(`Mentions financial terms: "${word}"`)
    }
  })
  
  suspiciousWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 20
      flags.push(`Contains suspicious phrase: "${word}"`)
    }
  })
  
  jobWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 25
      flags.push(`Contains job scam indicator: "${word}"`)
    }
  })
  
  otpWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 30
      flags.push(`Requests sensitive information: "${word}"`)
    }
  })
  
  // Check for suspicious URLs
  if (lowerText.includes("http") || lowerText.includes("www") || lowerText.includes(".com")) {
    score += 10
    flags.push("Contains external links")
  }
  
  // Cap score at 100
  score = Math.min(score, 100)
  
  // Determine risk level
  let riskLevel: RiskLevel = "safe"
  if (score >= 70) riskLevel = "likely-scam"
  else if (score >= 50) riskLevel = "high-risk"
  else if (score >= 25) riskLevel = "suspicious"
  
  // Determine scam type
  let scamType: ScamType = "unknown"
  if (lowerText.includes("otp") || lowerText.includes("pin")) scamType = "otp-theft"
  else if (jobWords.some(w => lowerText.includes(w))) scamType = "fake-job"
  else if (lowerText.includes("loan") || lowerText.includes("credit")) scamType = "loan-scam"
  else if (lowerText.includes("bank") || lowerText.includes("account")) scamType = "bank-fraud"
  else if (lowerText.includes("invest") || lowerText.includes("crypto")) scamType = "investment-scam"
  else if (suspiciousWords.some(w => lowerText.includes(w))) scamType = "phishing"
  
  // Recommendations based on risk level
  const recommendations = []
  if (score >= 25) {
    recommendations.push("Do not click any links in this message")
    recommendations.push("Do not share personal information")
  }
  if (score >= 50) {
    recommendations.push("Block the sender immediately")
    recommendations.push("Report this message to authorities")
  }
  if (score >= 70) {
    recommendations.push("Delete this message immediately")
    recommendations.push("Warn friends and family about this scam")
  }
  if (score < 25) {
    recommendations.push("This message appears safe, but always stay vigilant")
    recommendations.push("Verify sender identity if unsure")
  }
  
  return {
    riskLevel,
    riskScore: score,
    scamType: score >= 25 ? scamType : null,
    redFlags: flags.slice(0, 5),
    recommendations: recommendations.slice(0, 4),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      )
    }

    // Analyze the text
    const result = analyzeText(text)

    // Store in history (in production, this would go to a database)
    // For now, we'll simulate storage with a simple in-memory approach
    
    return NextResponse.json({
      success: true,
      result: {
        ...result,
        config: result.riskLevel ? riskConfig[result.riskLevel] : null,
        scamTypeLabel: result.scamType ? scamTypeLabels[result.scamType] : null,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
