import { Groq } from 'groq-sdk'

// Note: Gemini provider temporarily disabled due to build issues with @google-ai/generativelanguage
// Will be re-enabled once package compatibility is resolved

export interface AIProvider {
  name: string
  analyzeText(text: string, senderEmail?: string, subject?: string): Promise<AIAnalysisResult>
  isAvailable(): boolean
}

export interface AIAnalysisResult {
  riskLevel: 'safe' | 'suspicious' | 'high-risk' | 'likely-scam'
  riskScore: number
  scamType: string
  redFlags: string[]
  recommendations: string[]
  confidence: number
  explanation?: string
  provider: string
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini'

  isAvailable(): boolean {
    return !!process.env.GOOGLE_AI_API_KEY
  }

  async analyzeText(text: string, senderEmail?: string, subject?: string): Promise<AIAnalysisResult> {
    try {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          senderEmail,
          subject
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gemini API request failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Gemini analysis failed:', error)
      throw new Error(`Gemini analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export class GroqProvider implements AIProvider {
  name = 'Groq'
  private client: Groq | null = null

  constructor() {
    if (process.env.GROQ_API_KEY) {
      this.client = new Groq({ apiKey: process.env.GROQ_API_KEY })
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!process.env.GROQ_API_KEY
  }

  async analyzeText(text: string, senderEmail?: string, subject?: string): Promise<AIAnalysisResult> {
    if (!this.client) {
      throw new Error('Groq client not available')
    }

    try {
      const prompt = this.buildPrompt(text, senderEmail, subject)
      
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert scam detection specialist. Analyze messages for scam indicators and respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from Groq')
      }

      return this.parseResponse(response)
    } catch (error) {
      console.error('Groq analysis failed:', error)
      throw new Error(`Groq analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private buildPrompt(text: string, senderEmail?: string, subject?: string): string {
    let prompt = `Analyze this message for scam indicators and respond with JSON:

${subject ? `Subject: ${subject}\n` : ''}${senderEmail ? `From: ${senderEmail}\n` : ''}${text}

Required JSON format:
{
  "riskLevel": "safe|suspicious|high-risk|likely-scam",
  "riskScore": 0-100,
  "scamType": "phishing|fake-job|loan-scam|bank-fraud|investment-scam|otp-theft|romance-scam|lottery-scam|tech-support|unknown",
  "redFlags": ["specific indicators"],
  "recommendations": ["actionable advice"],
  "confidence": 0-100,
  "explanation": "brief reasoning"
}

Focus on: urgency, requests for info/money, suspicious links, grammar, sender credibility, emotional manipulation.`

    return prompt
  }

  private parseResponse(response: string): AIAnalysisResult {
    try {
      const parsed = JSON.parse(response)

      return {
        riskLevel: parsed.riskLevel || 'suspicious',
        riskScore: Math.min(100, Math.max(0, parsed.riskScore || 50)),
        scamType: parsed.scamType || 'unknown',
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        confidence: Math.min(100, Math.max(0, parsed.confidence || 70)),
        explanation: parsed.explanation || '',
        provider: this.name
      }
    } catch (error) {
      console.error('Failed to parse Groq response:', error)
      throw new Error('Failed to parse AI response')
    }
  }
}

export class AIEnhancementService {
  private providers: AIProvider[] = []
  private geminiProvider: GeminiProvider
  private groqProvider: GroqProvider

  constructor() {
    this.geminiProvider = new GeminiProvider()
    this.groqProvider = new GroqProvider()
    
    // Add providers in order of preference
    if (this.geminiProvider.isAvailable()) {
      this.providers.push(this.geminiProvider)
    }
    if (this.groqProvider.isAvailable()) {
      this.providers.push(this.groqProvider)
    }
  }

  isAvailable(): boolean {
    return this.providers.length > 0
  }

  getAvailableProviders(): string[] {
    return this.providers.map(p => p.name)
  }

  async enhanceAnalysis(
    text: string, 
    localResult: any, 
    senderEmail?: string, 
    subject?: string,
    forceAI: boolean = false
  ): Promise<any> {
    // Don't use AI if not available or not forced and local result is confident
    if (!this.isAvailable()) {
      return localResult
    }

    // Use AI if forced, or if local result is borderline (25-75 score), or if user requests detailed explanation
    const shouldUseAI = forceAI || 
      (localResult.riskScore >= 25 && localResult.riskScore <= 75) ||
      localResult.riskLevel === 'suspicious'

    if (!shouldUseAI) {
      return localResult
    }

    let lastError: Error | null = null

    // Try each provider in order
    for (const provider of this.providers) {
      try {
        console.log(`Trying AI provider: ${provider.name}`)
        const aiResult = await provider.analyzeText(text, senderEmail, subject)
        
        // Merge AI result with local result, preferring AI for detailed analysis
        return this.mergeResults(localResult, aiResult)
      } catch (error) {
        console.error(`${provider.name} failed:`, error)
        lastError = error instanceof Error ? error : new Error('Unknown error')
        continue
      }
    }

    // All AI providers failed, return local result
    console.warn('All AI providers failed, using local result:', lastError?.message)
    return localResult
  }

  private mergeResults(localResult: any, aiResult: AIAnalysisResult): any {
    return {
      ...localResult,
      riskLevel: aiResult.riskLevel,
      riskScore: aiResult.riskScore,
      scamType: aiResult.scamType,
      redFlags: [...new Set([...localResult.redFlags, ...aiResult.redFlags])], // Merge and deduplicate
      recommendations: [...new Set([...localResult.recommendations, ...aiResult.recommendations])],
      confidence: Math.max(localResult.confidence || 0, aiResult.confidence),
      aiEnhanced: true,
      aiProvider: aiResult.provider,
      aiExplanation: aiResult.explanation,
      detectedLanguages: localResult.detectedLanguages || []
    }
  }
}

// Singleton instance
export const aiService = new AIEnhancementService()
