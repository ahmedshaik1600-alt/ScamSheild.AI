# ScamShield

A powerful AI-powered scam detection application that helps users identify and protect themselves from various types of digital scams and fraudulent communications.

## Features

- **Text Analysis**: Analyze suspicious messages, SMS, emails, and WhatsApp texts
- **OCR Support**: Upload screenshots for automatic text extraction using Tesseract.js
- **Real-time Detection**: Instant scam risk analysis with detailed red flags
- **Comprehensive Database**: Track and view your scan history
- **Risk Scoring**: Get detailed risk percentages and threat levels
- **Mobile Responsive**: Works seamlessly on all devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Scam Types Detected

- Phishing attempts
- Fake job offers
- Loan scams
- Bank fraud
- Investment scams
- OTP theft
- And more...

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ScamShield-full-project
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/           # Backend API routes
│   │   ├── analyze/   # Text analysis endpoint
│   │   ├── history/   # Scan history endpoint
│   │   └── stats/     # Statistics endpoint
│   ├── dashboard/     # Dashboard page
│   ├── scan/         # Scan page
│   ├── history/      # History page
│   ├── login/        # Login page
│   ├── signup/       # Signup page
│   ├── about/        # About page
│   └── awareness/    # Awareness guide
├── components/
│   ├── ui/           # Reusable UI components
│   ├── navbar.tsx    # Navigation component
│   └── footer.tsx    # Footer component
└── hooks/
    └── use-toast.ts  # Toast notifications hook
```

## API Endpoints

### POST /api/analyze
Analyzes text for scam indicators.

**Request:**
```json
{
  "text": "Suspicious message to analyze"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "riskLevel": "likely-scam",
    "riskScore": 85,
    "scamType": "phishing",
    "redFlags": ["Contains urgency language"],
    "recommendations": ["Do not click links"],
    "timestamp": "2026-04-25T14:30:00Z"
  }
}
```

### GET /api/stats
Returns user statistics and analytics.

### GET /api/history
Returns user's scan history.

### POST /api/history
Saves a new analysis to history.

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- **Optional**: Database, Authentication, AI keys for enhanced features
- **Required**: None - core features work without external services

### Core Features (No API Keys Required)

- Text scam detection
- OCR screenshot analysis
- Scan history tracking
- Dashboard statistics
- All UI functionality

### Enhanced Features (Optional API Keys)

- User authentication with Supabase
- Enhanced AI detection with OpenAI/Anthropic
- Email notifications
- Analytics tracking

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **OCR**: Tesseract.js
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on the GitHub repository.
