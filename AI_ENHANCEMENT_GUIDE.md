# AI Enhancement Guide for ScamShield

This guide explains how to set up and use AI enhancement features in ScamShield to improve scam detection accuracy.

## 🤖 Overview

ScamShield uses a hybrid approach:
- **Default**: Local heuristic scam detection (always available)
- **Enhanced**: AI-powered analysis for borderline cases (optional)

### How AI Enhancement Works

1. **Local Analysis First**: Always runs local heuristic detection
2. **AI Trigger**: Uses AI for:
   - Borderline cases (risk score 25-75)
   - Suspicious level results
   - When user explicitly enables AI enhancement
3. **Fallback**: If AI fails, returns local result gracefully
4. **Provider Priority**: Tries Gemini first, then Groq as fallback

## 🚀 Quick Setup

### 1. Get AI API Keys

#### Groq AI (Recommended)
1. Go to [groq.com](https://groq.com)
2. Sign up for free account
3. Navigate to API Keys
4. Copy your API key

#### Google AI (Gemini) - Currently Disabled
1. Go to [ai.google.dev](https://ai.google.dev)
2. Create new project or use existing
3. Generate API key for Gemini API
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Groq AI (Working)
GROQ_API_KEY="gsk_your-groq-api-key-here"

# Google AI (Gemini) - Temporarily disabled due to build issues
# GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Optional: Legacy AI providers
# OPENAI_API_KEY="sk-your-openai-key"
# ANTHROPIC_API_KEY="your-anthropic-key"
```

### 3. Restart Your Application

```bash
npm run dev
```

## 📱 Using AI Enhancement

### In the Scan Page

1. **Toggle AI Enhancement**: Click the "🤖 Enable AI Enhancement" button
2. **Analyze Text**: Enter text and click "Analyze Text"
3. **View Results**: Look for the "🤖 AI Enhanced" badge
4. **AI Explanation**: See detailed AI reasoning in the results

### When AI is Used

- **Automatic**: Borderline cases (score 25-75) or suspicious results
- **Manual**: When user enables AI enhancement toggle
- **Fallback**: Always uses local detection if AI fails

### AI Enhancement Indicators

- **Badge**: Shows "🤖 AI Enhanced" with provider name
- **Explanation**: Detailed AI reasoning section
- **Enhanced Results**: More detailed red flags and recommendations

## 🔧 Configuration Options

### Environment Variables

```bash
# Required for AI enhancement
GROQ_API_KEY="your-groq-key"
GOOGLE_AI_API_KEY="your-google-key"  # Currently disabled

# Optional: Rate limiting and timeouts
# AI_TIMEOUT_MS="30000"
# AI_MAX_RETRIES="3"
```

### AI Provider Settings

#### Groq Configuration
- **Model**: Mixtral-8x7b-32768 (default)
- **Temperature**: 0.1 (consistent results)
- **Max Tokens**: 1000 (detailed analysis)
- **Response Format**: JSON (structured output)

#### Gemini Configuration (Future)
- **Model**: gemini-pro
- **Temperature**: 0.1
- **Max Output Tokens**: 1000
- **Response Format**: JSON

## 📊 AI vs Local Detection

### Local Heuristic Detection
- **Pros**: Always available, fast, no API costs, privacy-focused
- **Cons**: Limited to predefined patterns, may miss sophisticated scams
- **Best for**: Common scam patterns, quick analysis, offline use

### AI-Enhanced Detection
- **Pros**: Sophisticated analysis, contextual understanding, detailed explanations
- **Cons**: Requires API keys, slower response, potential costs, internet required
- **Best for**: Borderline cases, sophisticated scams, detailed analysis

### Hybrid Approach Benefits
- **Speed**: Local analysis provides instant results
- **Accuracy**: AI enhancement improves borderline cases
- **Reliability**: Graceful fallback if AI fails
- **Cost-Effective**: Only uses AI when needed

## 🛠️ Troubleshooting

### Common Issues

#### AI Enhancement Not Working
**Problem**: AI enhancement toggle doesn't show results
**Solutions**:
1. Check API keys in `.env.local`
2. Verify internet connection
3. Check browser console for errors
4. Ensure API keys have sufficient credits

#### Build Errors
**Problem**: Build fails with Google AI import errors
**Solution**: Google AI package temporarily disabled, use Groq instead

#### API Rate Limits
**Problem**: AI providers return rate limit errors
**Solutions**:
1. Check API key quotas
2. Wait and retry after rate limit resets
3. Consider upgrading API plan

#### Slow Response
**Problem**: AI analysis takes too long
**Solutions**:
1. Check internet connection
2. Try shorter text samples
3. Disable AI enhancement for faster local analysis

### Error Messages

#### "AI enhancement failed, using local result"
- **Meaning**: AI provider failed or unavailable
- **Action**: Check API keys and internet connection
- **Fallback**: Local analysis still works

#### "No AI providers available"
- **Meaning**: No valid API keys configured
- **Action**: Add GROQ_API_KEY to environment variables
- **Fallback**: Uses local analysis only

#### "AI provider not available"
- **Meaning**: Specific AI provider failed
- **Action**: Check provider-specific API key
- **Fallback**: Tries next provider or uses local analysis

## 🔒 Privacy & Security

### Data Privacy
- **Local Analysis**: All processing happens in your browser
- **AI Enhancement**: Text sent to AI providers for analysis
- **No Storage**: AI providers don't store your data (per their policies)

### API Key Security
- **Never commit API keys to version control**
- **Use environment variables only**
- **Regenerate keys if compromised**
- **Monitor API usage for unusual activity**

### Recommended Practices
- Use reputable AI providers (Groq, Google AI)
- Review AI provider privacy policies
- Consider data sensitivity before using AI enhancement
- Keep API keys secure and limited in scope

## 🚀 Advanced Usage

### Custom AI Prompts

The AI system uses structured prompts for consistent results. You can modify prompts in `lib/ai-providers.ts`:

```typescript
private buildPrompt(text: string, senderEmail?: string, subject?: string): string {
  // Custom prompt logic here
}
```

### Adding New AI Providers

1. Create new provider class implementing `AIProvider` interface
2. Add to `AIEnhancementService` constructor
3. Update environment variables
4. Test integration

### Performance Optimization

- **Caching**: Cache AI responses for similar texts
- **Batching**: Process multiple texts together
- **Timeouts**: Set appropriate timeouts for AI calls
- **Retries**: Implement retry logic for failed requests

## 📈 Monitoring & Analytics

### Tracking AI Usage

Monitor AI enhancement usage through:
- API provider dashboards
- Custom analytics logging
- Error tracking and alerting

### Performance Metrics

Track:
- AI vs local detection accuracy
- Response times
- Error rates
- User satisfaction

### Cost Management

- Monitor API usage and costs
- Set usage limits and alerts
- Optimize prompt efficiency
- Consider caching to reduce API calls

## 🔮 Future Enhancements

### Planned Features
- **Gemini Integration**: Re-enable Google AI provider
- **More Providers**: Add OpenAI, Anthropic, Claude
- **Custom Models**: Train specialized scam detection models
- **Batch Analysis**: Analyze multiple texts at once
- **Confidence Scoring**: Better confidence metrics

### Provider Roadmap
1. **Groq**: ✅ Working
2. **Gemini**: 🔄 Fixing build issues
3. **OpenAI**: 📋 Planned
4. **Anthropic**: 📋 Planned
5. **Custom Models**: 📋 Future

## 📞 Support

### Getting Help
- **Documentation**: Check this guide first
- **Issues**: Report bugs on GitHub
- **Community**: Join discussions for feature requests
- **AI Providers**: Check provider-specific documentation

### Contributing
- **Bug Reports**: File issues with detailed reproduction steps
- **Feature Requests**: Suggest improvements with use cases
- **Code Contributions**: Submit pull requests following guidelines
- **Documentation**: Help improve guides and examples

---

**Note**: AI enhancement is optional and ScamShield works perfectly with just local heuristic detection. AI enhancement provides additional accuracy for complex cases but requires API keys and internet connectivity.
