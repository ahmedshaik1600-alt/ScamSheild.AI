export type RiskLevel = "safe" | "suspicious" | "high-risk" | "likely-scam"
export type ScamType = "phishing" | "fake-job" | "loan-scam" | "bank-fraud" | "investment-scam" | "otp-theft" | "romance-scam" | "lottery-scam" | "tech-support" | "unknown"

export interface AnalysisResult {
  riskLevel: RiskLevel
  riskScore: number
  scamType: ScamType
  redFlags: string[]
  recommendations: string[]
  detectedLanguages: string[]
  confidence: number
}

export interface EmailAnalysis {
  senderSuspicious: boolean
  domainSpoofed: boolean
  subjectRisks: string[]
  senderAnalysis: {
    email: string
    domain: string
    suspicious: boolean
    reasons: string[]
  }
}

// Weighted Detection Model Interfaces
interface SignalDetection {
  type: 'weak' | 'strong' | 'structural' | 'trust'
  weight: number
  score: number
  description: string
  category: string
}

interface SignalAnalysis {
  weakSignals: SignalDetection[]
  strongSignals: SignalDetection[]
  structuralSignals: SignalDetection[]
  trustSignals: SignalDetection[]
  comboBonus: number
  baseScore: number
  finalScore: number
}

// Sophisticated keyword dictionaries with context awareness
const WEIGHTED_KEYWORDS = {
  en: {
    // Strong signals (high weight, clear scam indicators)
    strong: {
      urgency: {
        keywords: ["urgent", "immediately", "act now", "limited time", "expire soon", "don't wait", "now", "today", "asap"],
        weight: 25,
        context: "Creates artificial time pressure"
      },
      verification: {
        keywords: ["verify your account", "confirm your identity", "suspended account", "unusual activity", "verify account", "verify now", "confirm account", "secure account"],
        weight: 30,
        context: "Account security threats"
      },
      money_request: {
        keywords: ["send money", "wire transfer", "western union", "moneygram", "pay fee"],
        weight: 35,
        context: "Direct payment requests"
      },
      personal_info: {
        keywords: ["social security", "credit card", "bank account", "password", "pin code"],
        weight: 40,
        context: "Sensitive information requests"
      },
      threats: {
        keywords: ["legal action", "arrest warrant", "lawsuit", "prosecution", "court"],
        weight: 45,
        context: "Intimidation tactics"
      },
      // New: Short command patterns for phishing
      short_commands: {
        keywords: ["verify now", "click here", "login now", "update account", "secure now", "act immediately", "verify today"],
        weight: 35,
        context: "Short urgent command phrases"
      },
      // New: Link service mentions without full URLs (reduced weight for moderate risk)
      link_services: {
        keywords: ["tinyurl", "bit.ly", "bitly", "t.co", "goo.gl", "short.link", "ow.ly", "bit.do", "tiny.cc", "is.gd", "buff.ly"],
        weight: 12,
        context: "Link shortening service mentions (moderate risk alone)"
      }
    },
    
    // Weak signals (lower weight, subtle indicators)
    weak: {
      vague_offers: {
        keywords: ["special offer", "exclusive deal", "limited opportunity", "special promotion"],
        weight: 8,
        context: "Vague but enticing offers"
      },
      generic_greetings: {
        keywords: ["dear friend", "beloved", "kindly", "god bless", "respectable sir"],
        weight: 10,
        context: "Impersonal greetings"
      },
      emotional_appeals: {
        keywords: ["please help", "desperate", "emergency", "crisis", "urgent help needed"],
        weight: 12,
        context: "Emotional manipulation"
      },
      poor_grammar: {
        keywords: ["am writing to", "me and my family", "i am mr", "dear beneficiary"],
        weight: 8,
        context: "Language quality issues"
      }
    },

    // Contextual financial terms (reduced weight to avoid false positives)
    contextual_financial: {
      legitimate: {
        keywords: ["invoice", "receipt", "payment confirmation", "transaction", "balance"],
        weight: 3,
        context: "Normal financial terms"
      },
      suspicious: {
        keywords: ["unclaimed funds", "forgotten money", "secret account", "hidden fortune"],
        weight: 20,
        context: "Suspicious money claims"
      }
    }
  },
  
  ta: {
    strong: {
      urgency: {
        keywords: ["அவசரம்", "உடனடி", "இப்போது", "விரைவு"],
        weight: 25,
        context: "Time pressure"
      },
      money_request: {
        keywords: ["பணம் அனுப்பு", "பணம் மாற்றம்", "கட்டணம்"],
        weight: 35,
        context: "Payment requests"
      }
    },
    weak: {
      vague_offers: {
        keywords: ["சிறப்பு சலுகை", "வரையறுக்கப்பட்ட வாய்ப்பு"],
        weight: 8,
        context: "Vague offers"
      }
    },
    contextual_financial: {
      legitimate: {
        keywords: ["விலைப்பட்டியல்", "ரசீது", "பணம் செலுத்துதல்"],
        weight: 3,
        context: "Normal financial terms"
      },
      suspicious: {
        keywords: ["மறக்கப்பட்ட பணம்", "ரகசிய கணக்கு"],
        weight: 20,
        context: "Suspicious money claims"
      }
    }
  },
  
  hi: {
    strong: {
      urgency: {
        keywords: ["तत्काल", "फौरन", "अभी", "जल्दी"],
        weight: 25,
        context: "Time pressure"
      },
      money_request: {
        keywords: ["पैसा भेजें", "पैसा ट्रांसफर", "भुगतान"],
        weight: 35,
        context: "Payment requests"
      }
    },
    weak: {
      vague_offers: {
        keywords: ["विशेष ऑफर", "सीमित अवसर"],
        weight: 8,
        context: "Vague offers"
      }
    },
    contextual_financial: {
      legitimate: {
        keywords: ["इनवॉइस", "रसीद", "भुगतान पुष्टि"],
        weight: 3,
        context: "Normal financial terms"
      },
      suspicious: {
        keywords: ["भूली हुई पैसा", "गुप्त खाता"],
        weight: 20,
        context: "Suspicious money claims"
      }
    }
  }
}

// Structural signal patterns
const STRUCTURAL_PATTERNS = {
  suspicious_formatting: {
    patterns: [
      /\$\d{1,3},?\d{3},?\d{3}/, // Large dollar amounts
      /[A-Z]{5,}/, // Excessive capitalization
      /!{3,}/, // Excessive exclamation marks
      /\d{2,}\/\d{2,}\/\d{4}/, // Date patterns in scams
      /[0-9]{10,}/, // Long numbers (phone, account)
    ],
    weight: 15,
    context: "Suspicious formatting patterns"
  },
  
  url_patterns: {
    shorteners: ['bit.ly', 'tinyurl.com', 'short.link', 't.co', 'goo.gl', 'ow.ly'],
    suspicious_domains: ['support-center.com', 'security-team.com', 'verification-team.com'],
    ip_addresses: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    weight: 8, // Reduced from 20 to moderate risk
    context: "Suspicious URL patterns (moderate risk for shorteners alone)"
  },
  
  // New: Phishing command patterns
  phishing_commands: {
    patterns: [
      // Verify + account + urgency patterns
      /verify\s+account\s+(now|today|immediately|asap)/i,
      /verify\s+now\s+at\s+(\w+\.(com|net|org|io|co)|\w+)/i,
      /click\s+here\s+to\s+verify/i,
      /login\s+(now|today|immediately)/i,
      /update\s+account\s+(now|today|immediately)/i,
      /secure\s+account\s+(now|today|immediately)/i,
      // Short command + link service patterns
      /verify\s+now\s+at\s+(tinyurl|bit\.ly|t\.co|goo\.gl|short\.link)/i,
      /click\s+(tinyurl|bit\.ly|t\.co|goo\.gl|short\.link)/i,
      /login\s+at\s+(tinyurl|bit\.ly|t\.co|goo\.gl|short\.link)/i,
      // Account action + urgency patterns
      /account\s+(suspended|locked|limited)\s+(verify|click|login)/i,
      /unusual\s+activity\s+(verify|check|review)/i,
      /security\s+alert\s+(verify|check|review)/i,
    ],
    weight: 40,
    context: "Phishing command patterns"
  },
  
  message_structure: {
    very_short: { threshold: 50, weight: 15, context: "Very short suspicious message" }, // Increased weight
    very_long: { threshold: 1000, weight: 8, context: "Unusually long message" },
    single_paragraph: { weight: 5, context: "Poor message structure" },
    // New: Command-style structure
    command_style: { 
      patterns: [
        /^(verify|click|login|update|secure)\s+\w+/i,  // Starts with command
        /\w+\s+(now|today|immediately|asap)$/i,  // Ends with urgency
      ],
      weight: 20,
      context: "Command-style message structure"
    }
  }
}

// Trust signals (legitimate indicators)
const TRUST_SIGNALS = {
  legitimate_domains: [
    'microsoft.com', 'apple.com', 'google.com', 'amazon.com', 
    'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com'
  ],
  
  professional_language: {
    keywords: ["sincerely", "regards", "best regards", "thank you", "customer service"],
    weight: -5,
    context: "Professional communication"
  },
  
  verifiable_info: {
    keywords: ["order number", "reference id", "case number", "ticket number"],
    weight: -8,
    context: "Contains verifiable information"
  },
  
  company_names: {
    keywords: ["microsoft", "apple", "google", "amazon", "facebook", "paypal"],
    weight: -3, // Slight negative weight since often spoofed
    context: "Named legitimate companies"
  }
}

// Suspicious domains and patterns (legacy support)
const SUSPICIOUS_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', // Legitimate but commonly spoofed
  'support-center.com', 'security-team.com', 'verification-team.com',
  'microsoft-support.com', 'apple-support.com', 'google-support.com'
]

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'short.link', 't.co', 'goo.gl', 'ow.ly',
  'bit.do', 'mcaf.ee', 'tiny.cc', 'is.gd', 'buff.ly', 'adf.ly'
]

import { aiService, type AIAnalysisResult } from './ai-providers'

export class ScamDetector {
  private detectLanguage(text: string): string[] {
    const detected: string[] = []
    
    // Simple language detection based on character sets and keywords
    if (/[ஂ-௿]/.test(text)) detected.push('ta') // Tamil
    if (/[\u0900-\u097F]/.test(text)) detected.push('hi') // Hindi
    if (/[a-zA-Z]/.test(text)) detected.push('en') // English
    
    return detected.length > 0 ? detected : ['en']
  }

  // New weighted signal detection methods
  private detectWeakSignals(text: string, language: string): SignalDetection[] {
    const signals: SignalDetection[] = []
    const lowerText = text.toLowerCase()
    const keywords = WEIGHTED_KEYWORDS[language as keyof typeof WEIGHTED_KEYWORDS]

    if (!keywords || !keywords.weak) return signals

    Object.entries(keywords.weak).forEach(([category, config]) => {
      config.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          signals.push({
            type: 'weak',
            weight: config.weight,
            score: config.weight,
            description: `${category}: "${keyword}"`,
            category
          })
        }
      })
    })

    return signals
  }

  private detectStrongSignals(text: string, language: string): SignalDetection[] {
    const signals: SignalDetection[] = []
    const lowerText = text.toLowerCase()
    const keywords = WEIGHTED_KEYWORDS[language as keyof typeof WEIGHTED_KEYWORDS]

    if (!keywords || !keywords.strong) return signals

    Object.entries(keywords.strong).forEach(([category, config]) => {
      config.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          signals.push({
            type: 'strong',
            weight: config.weight,
            score: config.weight,
            description: `${category}: "${keyword}"`,
            category
          })
        }
      })
    })

    return signals
  }

  private detectContextualFinancialSignals(text: string, language: string): SignalDetection[] {
    const signals: SignalDetection[] = []
    const lowerText = text.toLowerCase()
    const keywords = WEIGHTED_KEYWORDS[language as keyof typeof WEIGHTED_KEYWORDS]

    if (!keywords || !keywords.contextual_financial) return signals

    Object.entries(keywords.contextual_financial).forEach(([category, config]) => {
      config.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          signals.push({
            type: category === 'legitimate' ? 'trust' : 'weak',
            weight: config.weight,
            score: config.weight,
            description: `${category} financial: "${keyword}"`,
            category: `financial_${category}`
          })
        }
      })
    })

    return signals
  }

  private detectStructuralSignals(text: string): SignalDetection[] {
    const signals: SignalDetection[] = []

    // Check formatting patterns
    STRUCTURAL_PATTERNS.suspicious_formatting.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        signals.push({
          type: 'structural',
          weight: STRUCTURAL_PATTERNS.suspicious_formatting.weight,
          score: STRUCTURAL_PATTERNS.suspicious_formatting.weight,
          description: `Suspicious formatting: ${pattern.source}`,
          category: 'formatting'
        })
      }
    })

    // Check phishing command patterns (NEW)
    if (STRUCTURAL_PATTERNS.phishing_commands) {
      STRUCTURAL_PATTERNS.phishing_commands.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          signals.push({
            type: 'structural',
            weight: STRUCTURAL_PATTERNS.phishing_commands.weight,
            score: STRUCTURAL_PATTERNS.phishing_commands.weight,
            description: `Phishing command: ${pattern.source}`,
            category: 'phishing_command'
          })
        }
      })
    }

    // Check message length
    if (text.length < STRUCTURAL_PATTERNS.message_structure.very_short.threshold) {
      signals.push({
        type: 'structural',
        weight: STRUCTURAL_PATTERNS.message_structure.very_short.weight,
        score: STRUCTURAL_PATTERNS.message_structure.very_short.weight,
        description: STRUCTURAL_PATTERNS.message_structure.very_short.context,
        category: 'length'
      })
    } else if (text.length > STRUCTURAL_PATTERNS.message_structure.very_long.threshold) {
      signals.push({
        type: 'structural',
        weight: STRUCTURAL_PATTERNS.message_structure.very_long.weight,
        score: STRUCTURAL_PATTERNS.message_structure.very_long.weight,
        description: STRUCTURAL_PATTERNS.message_structure.very_long.context,
        category: 'length'
      })
    }

    // Check command-style structure (NEW)
    if (STRUCTURAL_PATTERNS.message_structure.command_style) {
      STRUCTURAL_PATTERNS.message_structure.command_style.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          signals.push({
            type: 'structural',
            weight: STRUCTURAL_PATTERNS.message_structure.command_style.weight,
            score: STRUCTURAL_PATTERNS.message_structure.command_style.weight,
            description: `Command structure: ${pattern.source}`,
            category: 'command_structure'
          })
        }
      })
    }

    // Check URLs
    const urlPattern = /https?:\/\/[^\s]+/gi
    const urls = text.match(urlPattern) || []
    
    urls.forEach(url => {
      // Check for URL shorteners
      if (STRUCTURAL_PATTERNS.url_patterns.shorteners.some(shortener => url.includes(shortener))) {
        signals.push({
          type: 'structural',
          weight: STRUCTURAL_PATTERNS.url_patterns.weight,
          score: STRUCTURAL_PATTERNS.url_patterns.weight,
          description: `URL shortener: ${url}`,
          category: 'url'
        })
      }

      // Check for suspicious domains
      try {
        const domain = new URL(url).hostname
        if (STRUCTURAL_PATTERNS.url_patterns.suspicious_domains.some(suspDomain => domain.includes(suspDomain))) {
          signals.push({
            type: 'structural',
            weight: STRUCTURAL_PATTERNS.url_patterns.weight,
            score: STRUCTURAL_PATTERNS.url_patterns.weight,
            description: `Suspicious domain: ${domain}`,
            category: 'url'
          })
        }

        // Check for IP addresses
        if (STRUCTURAL_PATTERNS.url_patterns.ip_addresses.test(domain)) {
          signals.push({
            type: 'structural',
            weight: STRUCTURAL_PATTERNS.url_patterns.weight,
            score: STRUCTURAL_PATTERNS.url_patterns.weight,
            description: `IP address instead of domain: ${domain}`,
            category: 'url'
          })
        }
      } catch (e) {
        signals.push({
          type: 'structural',
          weight: STRUCTURAL_PATTERNS.url_patterns.weight,
          score: STRUCTURAL_PATTERNS.url_patterns.weight,
          description: `Malformed URL: ${url}`,
          category: 'url'
        })
      }
    })

    return signals
  }

  private detectTrustSignals(text: string, senderEmail?: string): SignalDetection[] {
    const signals: SignalDetection[] = []
    const lowerText = text.toLowerCase()

    // Check professional language
    TRUST_SIGNALS.professional_language.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        signals.push({
          type: 'trust',
          weight: TRUST_SIGNALS.professional_language.weight,
          score: TRUST_SIGNALS.professional_language.weight,
          description: `Professional language: "${keyword}"`,
          category: 'professional'
        })
      }
    })

    // Check verifiable information
    TRUST_SIGNALS.verifiable_info.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        signals.push({
          type: 'trust',
          weight: TRUST_SIGNALS.verifiable_info.weight,
          score: TRUST_SIGNALS.verifiable_info.weight,
          description: `Verifiable info: "${keyword}"`,
          category: 'verifiable'
        })
      }
    })

    // Check company names (slight negative weight since often spoofed)
    TRUST_SIGNALS.company_names.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        signals.push({
          type: 'trust',
          weight: TRUST_SIGNALS.company_names.weight,
          score: TRUST_SIGNALS.company_names.weight,
          description: `Company name: "${keyword}"`,
          category: 'company'
        })
      }
    })

    // Check email domain
    if (senderEmail) {
      try {
        const domain = senderEmail.split('@')[1]
        if (TRUST_SIGNALS.legitimate_domains.includes(domain)) {
          signals.push({
            type: 'trust',
            weight: -10,
            score: -10,
            description: `Legitimate domain: ${domain}`,
            category: 'domain'
          })
        }
      } catch (e) {
        // Invalid email format
      }
    }

    return signals
  }

  private calculateComboBonus(signals: SignalAnalysis): number {
    let bonus = 0
    const signalCounts = {
      weak: signals.weakSignals.length,
      strong: signals.strongSignals.length,
      structural: signals.structuralSignals.length,
      trust: signals.trustSignals.length
    }

    // Bonus for multiple signal types
    const activeTypes = Object.values(signalCounts).filter(count => count > 0).length
    if (activeTypes >= 3) bonus += 15
    if (activeTypes >= 4) bonus += 25

    // Bonus for multiple strong signals
    if (signalCounts.strong >= 2) bonus += 20
    if (signalCounts.strong >= 3) bonus += 35

    // Bonus for combination of weak + strong signals
    if (signalCounts.weak >= 2 && signalCounts.strong >= 1) bonus += 10
    if (signalCounts.weak >= 3 && signalCounts.strong >= 2) bonus += 20

    // NEW: Enhanced bonus for phishing combinations
    const hasVerification = signals.strongSignals.some(s => s.category === 'verification')
    const hasUrgency = signals.strongSignals.some(s => s.category === 'urgency') || 
                       signals.weakSignals.some(s => s.category === 'urgency')
    const hasLinkService = signals.strongSignals.some(s => s.category === 'link_services')
    const hasPhishingCommand = signals.structuralSignals.some(s => s.category === 'phishing_command')
    const hasShortMessage = signals.structuralSignals.some(s => s.category === 'length')
    const hasUrlShortener = signals.structuralSignals.some(s => s.category === 'url' && s.description.includes('shortener'))
    
    // High bonus for verify + urgency combinations
    if (hasVerification && hasUrgency) {
      bonus += 30
      if (hasLinkService || hasPhishingCommand || hasUrlShortener) {
        bonus += 35 // Extra bonus if also has link service or phishing command or URL shortener
      }
    }
    
    // NEW: Increased risk when shorteners combined with phishing terms
    if ((hasLinkService || hasUrlShortener) && (hasVerification || hasUrgency || hasPhishingCommand)) {
      bonus += 25 // Significant bonus for shortener + phishing term combinations
    }
    
    // Bonus for short messages with phishing indicators
    if (hasShortMessage && (hasPhishingCommand || hasLinkService || hasVerification || hasUrlShortener)) {
      bonus += 20
    }
    
    // Bonus for command structure + urgency
    const hasCommandStructure = signals.structuralSignals.some(s => s.category === 'command_structure')
    if (hasCommandStructure && hasUrgency) {
      bonus += 15
    }

    // Penalty for many trust signals (indicates legitimacy)
    if (signalCounts.trust >= 3) bonus -= 15
    if (signalCounts.trust >= 5) bonus -= 25

    return Math.max(-50, Math.min(50, bonus))
  }

  private determineScamType(signals: SignalAnalysis, text: string): ScamType {
    const lowerText = text.toLowerCase()
    const categories = new Set<string>()

    // Collect all signal categories
    signals.weakSignals.forEach(signal => categories.add(signal.category))
    signals.strongSignals.forEach(signal => categories.add(signal.category))
    signals.structuralSignals.forEach(signal => categories.add(signal.category))

    // NEW: Enhanced phishing detection for short messages
    if (categories.has('verification') || categories.has('link_services') || categories.has('phishing_command')) {
      if (categories.has('urgency') || lowerText.includes('now') || lowerText.includes('immediately')) {
        return 'phishing'
      }
    }
    
    // Determine scam type based on dominant categories
    if (categories.has('money_request') || categories.has('suspicious_financial')) {
      if (lowerText.includes('loan') || lowerText.includes('credit')) return 'loan-scam'
      if (lowerText.includes('bank') || lowerText.includes('account')) return 'bank-fraud'
      if (lowerText.includes('invest') || lowerText.includes('crypto')) return 'investment-scam'
    }

    if (categories.has('personal_info') || categories.has('verification')) return 'phishing'
    if (categories.has('url') && categories.has('urgency')) return 'phishing'
    if (categories.has('threats')) return 'bank-fraud'
    if (lowerText.includes('otp') || lowerText.includes('code')) return 'otp-theft'
    if (lowerText.includes('love') || lowerText.includes('marry')) return 'romance-scam'
    if (lowerText.includes('lottery') || lowerText.includes('winner')) return 'lottery-scam'
    if (lowerText.includes('virus') || lowerText.includes('support')) return 'tech-support'

    return 'unknown'
  }

  private performWeightedAnalysis(text: string, senderEmail?: string, subject?: string): SignalAnalysis {
    const languages = this.detectLanguage(text)
    
    const analysis: SignalAnalysis = {
      weakSignals: [],
      strongSignals: [],
      structuralSignals: [],
      trustSignals: [],
      comboBonus: 0,
      baseScore: 0,
      finalScore: 0
    }

    // Analyze each detected language
    languages.forEach(lang => {
      analysis.weakSignals.push(...this.detectWeakSignals(text, lang))
      analysis.strongSignals.push(...this.detectStrongSignals(text, lang))
      analysis.weakSignals.push(...this.detectContextualFinancialSignals(text, lang))
    })

    // Structural and trust signals are language-independent
    analysis.structuralSignals.push(...this.detectStructuralSignals(text))
    analysis.trustSignals.push(...this.detectTrustSignals(text, senderEmail))

    // Calculate base score
    const allSignals = [
      ...analysis.weakSignals,
      ...analysis.strongSignals, 
      ...analysis.structuralSignals,
      ...analysis.trustSignals
    ]

    analysis.baseScore = allSignals.reduce((sum, signal) => sum + signal.score, 0)

    // Calculate combo bonus
    analysis.comboBonus = this.calculateComboBonus(analysis)

    // Calculate final score
    analysis.finalScore = Math.max(0, Math.min(100, analysis.baseScore + analysis.comboBonus))

    return analysis
  }

  async analyzeText(text: string, senderEmail?: string, subject?: string, forceAI: boolean = false): Promise<AnalysisResult> {
    // First run weighted analysis
    const weightedResult = this.performWeightedAnalysis(text, senderEmail, subject)
    const localResult = this.convertToAnalysisResult(weightedResult, text, senderEmail, subject)
    
    // Then enhance with AI if available and appropriate
    try {
      const enhancedResult = await aiService.enhanceAnalysis(text, localResult, senderEmail, subject, forceAI)
      return enhancedResult
    } catch (error) {
      console.warn('AI enhancement failed, using weighted result:', error)
      return localResult
    }
  }

  private convertToAnalysisResult(signals: SignalAnalysis, text: string, senderEmail?: string, subject?: string): AnalysisResult {
    // Generate red flags from signals
    const redFlags: string[] = []
    const allSignals = [
      ...signals.weakSignals,
      ...signals.strongSignals,
      ...signals.structuralSignals,
      ...signals.trustSignals.filter(s => s.score > 0) // Only include positive trust signals as red flags
    ]

    // Sort signals by score and take top ones
    allSignals.sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    redFlags.push(...allSignals.slice(0, 10).map(s => s.description))

    // Determine scam type
    const scamType = this.determineScamType(signals, text)

    // Determine risk level with new thresholds
    let riskLevel: RiskLevel = "safe"
    if (signals.finalScore >= 75) riskLevel = "likely-scam"
    else if (signals.finalScore >= 55) riskLevel = "high-risk"
    else if (signals.finalScore >= 30) riskLevel = "suspicious"

    // Generate recommendations
    const recommendations = this.generateRecommendations(riskLevel, scamType)

    // Calculate confidence based on signal diversity and strength
    const signalDiversity = new Set([
      ...signals.weakSignals.map(s => s.category),
      ...signals.strongSignals.map(s => s.category),
      ...signals.structuralSignals.map(s => s.category)
    ]).size
    
    const confidence = Math.min(100, Math.max(50, 
      (signals.finalScore * 0.6) + 
      (signalDiversity * 5) + 
      (signals.strongSignals.length * 8)
    ))

    return {
      riskLevel,
      riskScore: signals.finalScore,
      scamType: signals.finalScore >= 30 ? scamType : "unknown",
      redFlags,
      recommendations: recommendations.slice(0, 6),
      detectedLanguages: this.detectLanguage(text),
      confidence
    }
  }

  // Legacy method for backward compatibility (synchronous version)
  analyzeTextSync(text: string, senderEmail?: string, subject?: string): AnalysisResult {
    const weightedResult = this.performWeightedAnalysis(text, senderEmail, subject)
    return this.convertToAnalysisResult(weightedResult, text, senderEmail, subject)
  }

  private generateRecommendations(riskLevel: RiskLevel, scamType: ScamType): string[] {
    const recommendations: string[] = []

    if (riskLevel === "safe") {
      recommendations.push("This message appears safe, but always stay vigilant")
      recommendations.push("Verify sender identity if unsure")
      return recommendations
    }

    // Base recommendations for all risky messages
    recommendations.push("Do not click any links in this message")
    recommendations.push("Do not share personal or financial information")

    if (riskLevel === "suspicious") {
      recommendations.push("Verify the sender through a different communication channel")
      recommendations.push("Check with the supposed organization directly")
    }

    if (riskLevel === "high-risk") {
      recommendations.push("Block the sender immediately")
      recommendations.push("Report this message to relevant authorities")
      recommendations.push("Warn friends and family about similar messages")
    }

    if (riskLevel === "likely-scam") {
      recommendations.push("Delete this message immediately")
      recommendations.push("Report to cybercrime authorities")
      recommendations.push("Change passwords if you clicked any links")
      recommendations.push("Monitor financial accounts for suspicious activity")
    }

    // Type-specific recommendations
    switch (scamType) {
      case "otp-theft":
        recommendations.push("Never share OTP codes with anyone")
        recommendations.push("Contact your bank directly if concerned")
        break
      case "phishing":
        recommendations.push("Check sender email address carefully")
        recommendations.push("Hover over links to see actual URL before clicking")
        break
      case "fake-job":
        recommendations.push("Legitimate jobs don't require upfront payments")
        recommendations.push("Research the company on official websites")
        break
      case "bank-fraud":
        recommendations.push("Banks never ask for sensitive details via email/SMS")
        recommendations.push("Call your bank using official phone numbers only")
        break
      case "investment-scam":
        recommendations.push("Verify investment opportunities with regulators")
        recommendations.push("Be skeptical of guaranteed high returns")
        break
      case "romance-scam":
        recommendations.push("Never send money to someone you haven't met")
        recommendations.push("Be suspicious of quick declarations of love")
        break
      case "lottery-scam":
        recommendations.push("You can't win lotteries you didn't enter")
        recommendations.push("Never pay fees to claim prizes")
        break
      case "tech-support":
        recommendations.push("Tech companies never contact you unsolicited")
        recommendations.push("Never grant remote access to your computer")
        break
    }

    return recommendations
  }
}

// Export singleton instance
export const scamDetector = new ScamDetector()
