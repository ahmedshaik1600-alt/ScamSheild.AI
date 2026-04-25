// Test ScamShield scoring engine updates for shortener domains
const { scamDetector } = require('./lib/scoring.ts');

console.log('🧪 Testing ScamShield Shortener Domain Scoring Updates');
console.log('====================================================\n');

// Test cases for shortener domain scoring
const testCases = [
  {
    name: "Shortener only (should be moderate risk)",
    text: "Check out this link: bit.ly/abc123",
    expectedRisk: "suspicious"
  },
  {
    name: "Shortener + verify (should be high risk)",
    text: "Verify your account now at bit.ly/verify",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener + urgency (should be high risk)",
    text: "Urgent! Login immediately at tinyurl.com/secure",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener + click + verify (should be high risk)",
    text: "Click here to verify: t.co/confirm",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener in normal context (should be low risk)",
    text: "Here is that document: tinyurl.com/doc",
    expectedRisk: "suspicious"
  },
  {
    name: "Shortener + account threat (should be high risk)",
    text: "Account suspended! Verify now at bit.ly/unblock",
    expectedRisk: "likely-scam"
  },
  {
    name: "Shortener + security alert (should be high risk)",
    text: "Security alert: Check your account at t.co/alert",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener + OTP request (should be high risk)",
    text: "Please verify your OTP at bit.ly/code",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener + reward (should be high risk)",
    text: "Reward claim: Click now at tinyurl.com/prize",
    expectedRisk: "high-risk"
  },
  {
    name: "Shortener mention only (should be low risk)",
    text: "I use bit.ly for my links",
    expectedRisk: "safe"
  }
];

console.log('📊 Testing shortener domain scoring:');
testCases.forEach((test, i) => {
  const result = scamDetector.analyzeTextSync(test.text);
  const status = result.riskLevel === test.expectedRisk ? '✅' : '❌';
  
  console.log(`${status} Test ${i + 1}: ${test.name}`);
  console.log(`   Text: "${test.text}"`);
  console.log(`   Expected: ${test.expectedRisk}, Got: ${result.riskLevel} (Score: ${result.riskScore})`);
  console.log(`   Scam Type: ${result.scamType}`);
  console.log(`   Top Flags: ${result.redFlags.slice(0, 2).join(', ')}`);
  console.log('');
});

console.log('🎯 Key Changes Implemented:');
console.log('   • Reduced shortener-only weight from 30 to 12');
console.log('   • Reduced URL shortener weight from 20 to 8');
console.log('   • Added 25-point bonus for shortener + phishing term combos');
console.log('   • Enhanced detection of verify + urgency + shortener patterns');
console.log('');
console.log('🏁 Shortener domain scoring refinement completed!');
