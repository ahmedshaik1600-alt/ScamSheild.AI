import { NextResponse } from 'next/server'

// Mock history data - in production, this would come from a database
const mockHistory = [
  {
    id: 1,
    date: '2026-04-25T14:30:00Z',
    text: 'Your account has been suspended. Click here to verify your information immediately to avoid permanent closure.',
    riskScore: 85,
    riskLevel: 'likely-scam',
    scamType: 'phishing',
    redFlags: ['Contains urgency language: "immediately"', 'Contains suspicious phrase: "verify"', 'Contains suspicious phrase: "suspended"'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Block the sender immediately', 'Report this message to authorities']
  },
  {
    id: 2,
    date: '2026-04-25T12:15:00Z',
    text: 'Congratulations! You have won $1,000,000 in our lottery. Please send your bank details to claim your prize.',
    riskScore: 92,
    riskLevel: 'likely-scam',
    scamType: 'phishing',
    redFlags: ['Mentions financial terms: "prize"', 'Mentions financial terms: "bank"', 'Contains urgency language: "congratulations"'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Block the sender immediately', 'Delete this message immediately']
  },
  {
    id: 3,
    date: '2026-04-25T10:45:00Z',
    text: 'URGENT: Your bank account requires immediate verification. Please call this number now: +1-800-SCAM.',
    riskScore: 78,
    riskLevel: 'high-risk',
    scamType: 'bank-fraud',
    redFlags: ['Contains urgency language: "urgent"', 'Contains urgency language: "immediate"', 'Mentions financial terms: "bank"'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Block the sender immediately', 'Report this message to authorities']
  },
  {
    id: 4,
    date: '2026-04-25T09:20:00Z',
    text: 'Hi Mom, just checking in. How are you doing? Can we talk later tonight?',
    riskScore: 5,
    riskLevel: 'safe',
    scamType: null,
    redFlags: [],
    recommendations: ['This message appears safe, but always stay vigilant', 'Verify sender identity if unsure']
  },
  {
    id: 5,
    date: '2026-04-24T18:30:00Z',
    text: 'Work from home! Earn $5000 per week. No experience needed. Just pay $50 registration fee.',
    riskScore: 88,
    riskLevel: 'likely-scam',
    scamType: 'fake-job',
    redFlags: ['Contains job scam indicator: "work from home"', 'Contains job scam indicator: "easy money"', 'Mentions financial terms: "payment"'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Block the sender immediately', 'Delete this message immediately']
  },
  {
    id: 6,
    date: '2026-04-24T15:20:00Z',
    text: 'Your OTP is 123456. Please do not share this with anyone. - Your Bank',
    riskScore: 12,
    riskLevel: 'safe',
    scamType: null,
    redFlags: ['Requests sensitive information: "otp"'],
    recommendations: ['This message appears safe, but always stay vigilant', 'Never share OTPs with unknown numbers']
  },
  {
    id: 7,
    date: '2026-04-24T11:10:00Z',
    text: 'Invest in Bitcoin now! Guaranteed 300% returns in 30 days. Limited time offer.',
    riskScore: 95,
    riskLevel: 'likely-scam',
    scamType: 'investment-scam',
    redFlags: ['Contains urgency language: "limited time"', 'Mentions financial terms: "invest"', 'Too-good-to-be-true offer'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Block the sender immediately', 'Delete this message immediately']
  },
  {
    id: 8,
    date: '2026-04-23T16:45:00Z',
    text: 'We have detected unusual activity on your account. Please confirm your identity.',
    riskScore: 65,
    riskLevel: 'high-risk',
    scamType: 'phishing',
    redFlags: ['Contains suspicious phrase: "unusual activity"', 'Contains suspicious phrase: "confirm"', 'Contains suspicious phrase: "detected"'],
    recommendations: ['Do not click any links in this message', 'Do not share personal information', 'Contact the company directly']
  }
]

export async function GET() {
  try {
    // In production, you would:
    // 1. Check if user is authenticated
    // 2. Fetch user-specific history from database
    // 3. Return paginated results
    
    return NextResponse.json({
      success: true,
      history: mockHistory,
      total: mockHistory.length
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { analysis } = body

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Check if user is authenticated
    // 2. Save the analysis to database
    // 3. Return the saved record with ID
    
    const newEntry = {
      id: mockHistory.length + 1,
      ...analysis,
      date: new Date().toISOString()
    }

    // Add to mock data (in production, this would be a database insert)
    mockHistory.unshift(newEntry)

    return NextResponse.json({
      success: true,
      entry: newEntry
    })
  } catch (error) {
    console.error('History save error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
