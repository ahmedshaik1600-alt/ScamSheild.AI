import { NextResponse } from 'next/server'

// Mock stats data - in production, this would come from a database
const mockStats = {
  totalAnalyses: 1247,
  highRiskMessages: 189,
  topScamType: "phishing",
  recentChecks: 45,
  threatsDetected: 189,
  safeMessages: 1058,
  protectionScore: 85,
  trendData: [
    { date: '2026-04-18', analyses: 12, threats: 2 },
    { date: '2026-04-19', analyses: 18, threats: 3 },
    { date: '2026-04-20', analyses: 15, threats: 1 },
    { date: '2026-04-21', analyses: 22, threats: 4 },
    { date: '2026-04-22', analyses: 19, threats: 2 },
    { date: '2026-04-23', analyses: 25, threats: 5 },
    { date: '2026-04-24', analyses: 31, threats: 7 },
    { date: '2026-04-25', analyses: 28, threats: 6 },
  ],
  categoryData: [
    { category: 'Phishing', count: 89, percentage: 47 },
    { category: 'OTP Theft', count: 34, percentage: 18 },
    { category: 'Fake Job', count: 28, percentage: 15 },
    { category: 'Bank Fraud', count: 22, percentage: 12 },
    { category: 'Loan Scam', count: 16, percentage: 8 },
  ],
  recentActivity: [
    {
      id: 1,
      date: '2026-04-25T14:30:00Z',
      text: 'Your account has been suspended. Click here to verify...',
      riskScore: 85,
      riskLevel: 'likely-scam',
      scamType: 'phishing'
    },
    {
      id: 2,
      date: '2026-04-25T12:15:00Z',
      text: 'Congratulations! You have won $1,000,000 in our lottery...',
      riskScore: 92,
      riskLevel: 'likely-scam',
      scamType: 'phishing'
    },
    {
      id: 3,
      date: '2026-04-25T10:45:00Z',
      text: 'URGENT: Your bank account requires immediate verification...',
      riskScore: 78,
      riskLevel: 'high-risk',
      scamType: 'bank-fraud'
    },
    {
      id: 4,
      date: '2026-04-25T09:20:00Z',
      text: 'Hi Mom, can you send me $200? I need it for an emergency...',
      riskScore: 15,
      riskLevel: 'safe',
      scamType: null
    },
    {
      id: 5,
      date: '2026-04-24T18:30:00Z',
      text: 'Work from home! Earn $5000 per week. No experience needed...',
      riskScore: 88,
      riskLevel: 'likely-scam',
      scamType: 'fake-job'
    }
  ]
}

export async function GET() {
  try {
    // In production, you would:
    // 1. Check if user is authenticated
    // 2. Fetch user-specific stats from database
    // 3. Return personalized data
    
    return NextResponse.json({
      success: true,
      stats: mockStats
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
