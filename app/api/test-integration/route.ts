import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Groq } from 'groq-sdk'

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      groqKey: !!process.env.GROQ_API_KEY,
      geminiKey: !!process.env.GOOGLE_AI_API_KEY,
    },
    tests: {}
  }

  // Test Supabase connection
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)
      
      results.tests.supabase = {
        status: error ? 'failed' : 'success',
        message: error?.message || 'Connection successful',
        details: error ? null : { connected: true }
      }
    } else {
      results.tests.supabase = {
        status: 'skipped',
        message: 'Supabase credentials not configured',
        details: null
      }
    }
  } catch (error) {
    results.tests.supabase = {
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: null
    }
  }

  // Test Groq API
  try {
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a scam detection assistant. Respond with JSON only.'
          },
          {
            role: 'user',
            content: 'Analyze this message: "Click here to claim your prize!" Respond with: {"riskLevel": "likely-scam", "riskScore": 85}'
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.1,
        max_tokens: 100,
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0]?.message?.content
      results.tests.groq = {
        status: response ? 'success' : 'failed',
        message: response ? 'API call successful' : 'No response received',
        details: response ? { sampleResponse: JSON.parse(response) } : null
      }
    } else {
      results.tests.groq = {
        status: 'skipped',
        message: 'Groq API key not configured',
        details: null
      }
    }
  } catch (error) {
    results.tests.groq = {
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: null
    }
  }

  // Test Gemini API
  try {
    if (process.env.GOOGLE_AI_API_KEY) {
      // Test via Gemini API route
      const geminiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/ai/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Click here to claim your prize!",
          subject: "You won!",
        })
      })

      if (geminiResponse.ok) {
        const geminiResult = await geminiResponse.json()
        results.tests.gemini = {
          status: 'success',
          message: 'Gemini API call successful',
          details: { sampleResponse: geminiResult }
        }
      } else {
        const error = await geminiResponse.json()
        results.tests.gemini = {
          status: 'failed',
          message: error.error || 'Gemini API call failed',
          details: null
        }
      }
    } else {
      results.tests.gemini = {
        status: 'skipped',
        message: 'Gemini API key not configured',
        details: null
      }
    }
  } catch (error) {
    results.tests.gemini = {
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: null
    }
  }

  // Test AI Enhancement Service
  try {
    const { aiService } = await import('@/lib/ai-providers')
    const available = aiService.isAvailable()
    const providers = aiService.getAvailableProviders()
    
    results.tests.aiEnhancement = {
      status: available ? 'success' : 'failed',
      message: available ? 'AI Enhancement Service available' : 'No AI providers available',
      details: { available, providers }
    }
  } catch (error) {
    results.tests.aiEnhancement = {
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: null
    }
  }

  // Test Storage Service
  try {
    const { storage } = await import('@/lib/storage')
    const testItem = {
      id: 'test-' + Date.now(),
      text: 'Test message',
      riskLevel: 'safe' as const,
      riskScore: 10,
      scamType: 'unknown' as const,
      redFlags: [],
      recommendations: [],
      confidence: 90,
      detectedLanguages: ['en'],
      timestamp: new Date().toISOString()
    }

    await storage.saveAnalysis(testItem)
    const history = await storage.getHistory()
    const found = history.find(item => item.id === testItem.id)
    
    results.tests.storage = {
      status: found ? 'success' : 'failed',
      message: found ? 'Storage service working' : 'Storage service failed',
      details: { saved: !!found, totalHistory: history.length }
    }
  } catch (error) {
    results.tests.storage = {
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: null
    }
  }

  // Calculate overall status
  const testStatuses = Object.values(results.tests).map((test: any) => test.status)
  const successCount = testStatuses.filter((status: string) => status === 'success').length
  const skippedCount = testStatuses.filter((status: string) => status === 'skipped').length
  const failedCount = testStatuses.filter((status: string) => status === 'failed').length

  results.summary = {
    total: testStatuses.length,
    success: successCount,
    skipped: skippedCount,
    failed: failedCount,
    overall: failedCount === 0 ? 'success' : 'partial'
  }

  return NextResponse.json(results)
}
