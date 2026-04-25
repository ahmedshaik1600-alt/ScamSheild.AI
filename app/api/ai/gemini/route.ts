import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, senderEmail, subject } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Check if Gemini API key is available
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Import Gemini dynamically to avoid build issues
    const { GoogleGenerativeAI } = await import('@google-ai/generativelanguage')
    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `You are an expert scam detection specialist. Analyze the following message and provide a detailed assessment.

Message to analyze:
${subject ? `Subject: ${subject}\n` : ''}${senderEmail ? `From: ${senderEmail}\n` : ''}${text}

Please analyze this for scam indicators and respond in this exact JSON format:
{
  "riskLevel": "safe|suspicious|high-risk|likely-scam",
  "riskScore": 0-100,
  "scamType": "phishing|fake-job|loan-scam|bank-fraud|investment-scam|otp-theft|romance-scam|lottery-scam|tech-support|unknown",
  "redFlags": ["flag1", "flag2", "flag3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "confidence": 0-100,
  "explanation": "Brief explanation of why this was classified this way"
}

Consider these factors:
- Urgency and pressure tactics
- Requests for personal/financial information
- Suspicious links or attachments
- Grammar and language quality
- Sender credibility (if email provided)
- Too-good-to-be-true offers
- Impersonation attempts
- Emotional manipulation

Be thorough but concise. Focus on actual risk indicators.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()

    // Try to extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    const analysisResult = {
      riskLevel: parsed.riskLevel || 'suspicious',
      riskScore: Math.min(100, Math.max(0, parsed.riskScore || 50)),
      scamType: parsed.scamType || 'unknown',
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      confidence: Math.min(100, Math.max(0, parsed.confidence || 70)),
      explanation: parsed.explanation || '',
      provider: 'Gemini'
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Gemini analysis failed' },
      { status: 500 }
    )
  }
}
