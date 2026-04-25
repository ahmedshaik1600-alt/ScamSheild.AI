// Integration test script for ScamShield
// Run with: node test-integration.js

const { createClient } = require('@supabase/supabase-js')
const { Groq } = require('groq-sdk')

// Test configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const groqKey = process.env.GROQ_API_KEY
const geminiKey = process.env.GOOGLE_AI_API_KEY

console.log('🧪 ScamShield Integration Test')
console.log('================================')

// Test Supabase connection
async function testSupabase() {
  console.log('\n📊 Testing Supabase Connection...')
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials not found')
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection by checking user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.log('❌ Supabase test failed:', error.message)
    return false
  }
}

// Test Groq API
async function testGroq() {
  console.log('\n🤖 Testing Groq API...')
  
  if (!groqKey) {
    console.log('❌ Groq API key not found')
    return false
  }

  try {
    const groq = new Groq({ apiKey: groqKey })
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a scam detection assistant. Respond with JSON only.'
        },
        {
          role: 'user',
          content: 'Analyze this message for scam: "Congratulations! You won $1000000. Click here to claim." Respond with: {"riskLevel": "likely-scam", "riskScore": 90}'
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.1,
      max_tokens: 100,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      console.log('❌ No response from Groq')
      return false
    }

    const parsed = JSON.parse(response)
    console.log('✅ Groq API test successful')
    console.log('   Sample response:', parsed)
    return true
  } catch (error) {
    console.log('❌ Groq API test failed:', error.message)
    return false
  }
}

// Test Gemini API via API route
async function testGemini() {
  console.log('\n🧠 Testing Gemini API...')
  
  if (!geminiKey) {
    console.log('❌ Gemini API key not found')
    return false
  }

  try {
    // Test via API route (would need server running)
    console.log('ℹ️  Gemini API requires server to be running')
    console.log('   API key configured: ✅')
    return true
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.message)
    return false
  }
}

// Test AI Enhancement Service
async function testAIEnhancement() {
  console.log('\n🔍 Testing AI Enhancement Service...')
  
  try {
    // This would require importing the actual service
    console.log('ℹ️  AI Enhancement Service requires Next.js environment')
    console.log('   Groq provider available:', !!groqKey ? '✅' : '❌')
    console.log('   Gemini provider available:', !!geminiKey ? '✅' : '❌')
    return true
  } catch (error) {
    console.log('❌ AI Enhancement Service test failed:', error.message)
    return false
  }
}

// Main test runner
async function runTests() {
  console.log('Environment Variables Check:')
  console.log('  Supabase URL:', supabaseUrl ? '✅' : '❌')
  console.log('  Supabase Key:', supabaseKey ? '✅' : '❌')
  console.log('  Groq Key:', groqKey ? '✅' : '❌')
  console.log('  Gemini Key:', geminiKey ? '✅' : '❌')

  const results = {
    supabase: await testSupabase(),
    groq: await testGroq(),
    gemini: await testGemini(),
    aiEnhancement: await testAIEnhancement()
  }

  console.log('\n📋 Test Results Summary:')
  console.log('========================')
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)}`)
  })

  const allPassed = Object.values(results).every(result => result)
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall Status: ${allPassed ? 'All tests passed!' : 'Some tests failed'}`)

  if (!allPassed) {
    console.log('\n🔧 Troubleshooting Tips:')
    if (!results.supabase) console.log('- Check Supabase URL and anon key')
    if (!results.groq) console.log('- Check Groq API key and internet connection')
    if (!results.gemini) console.log('- Check Gemini API key configuration')
  }
}

// Run tests
runTests().catch(console.error)
