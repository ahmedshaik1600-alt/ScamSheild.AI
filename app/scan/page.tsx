"use client"

import { useState, useRef } from "react"
import { Upload, Scan, Trash2, Copy, RefreshCw, AlertTriangle, CheckCircle, AlertCircle, XCircle, Shield, ArrowLeft, Download, Mail, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Tesseract from 'tesseract.js'
import jsPDF from 'jspdf'
import { scamDetector, type AnalysisResult, type RiskLevel, type ScamType } from '@/lib/scoring'
import { storage } from '@/lib/storage'

const riskConfig = {
  "safe": { 
    label: "Safe", 
    color: "text-success", 
    bgColor: "bg-success/10", 
    borderColor: "border-success/30",
    icon: CheckCircle 
  },
  "suspicious": { 
    label: "Suspicious", 
    color: "text-warning", 
    bgColor: "bg-warning/10", 
    borderColor: "border-warning/30",
    icon: AlertCircle 
  },
  "high-risk": { 
    label: "High Risk", 
    color: "text-danger", 
    bgColor: "bg-danger/10", 
    borderColor: "border-danger/30",
    icon: AlertTriangle 
  },
  "likely-scam": { 
    label: "Likely Scam", 
    color: "text-danger", 
    bgColor: "bg-danger/10", 
    borderColor: "border-danger/30",
    icon: XCircle 
  },
}

const scamTypeLabels: Record<string, string> = {
  "phishing": "Phishing",
  "fake-job": "Fake Job",
  "loan-scam": "Loan Scam",
  "bank-fraud": "Bank Fraud",
  "investment-scam": "Investment Scam",
  "otp-theft": "OTP Theft",
  "romance-scam": "Romance Scam",
  "lottery-scam": "Lottery Scam",
  "tech-support": "Tech Support",
  "unknown": "Unknown",
}

export default function ScanPage() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [showEmailFields, setShowEmailFields] = useState(false)
  const [senderEmail, setSenderEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [showAIEnhancement, setShowAIEnhancement] = useState(false)
  const [isAIEnhanced, setIsAIEnhanced] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle back button navigation
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer
      if (referrer.includes('/scan/ocr')) {
        window.location.href = '/tools'
      } else if (referrer.includes('/tools')) {
        window.location.href = '/'
      } else if (referrer.includes('/dashboard')) {
        window.location.href = '/'
      } else {
        window.location.href = '/'
      }
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      })
      return
    }
    
    setError(null)
    setIsAnalyzing(true)
    
    try {
      // Use local analysis engine with optional AI enhancement
      const analysis = await scamDetector.analyzeText(text, senderEmail || undefined, subject || undefined, showAIEnhancement)
      
      setResult(analysis)
      setIsAIEnhanced(!!(analysis as any).aiEnhanced)
      
      // Save to localStorage
      await storage.saveAnalysis({
        ...analysis,
        text: text.trim(),
        senderEmail: senderEmail || undefined,
        subject: subject || undefined,
        timestamp: new Date().toISOString()
      })
      
      toast({
        title: "Analysis Complete",
        description: "Message analyzed successfully",
      })
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setText("")
    setResult(null)
    setError(null)
    setSenderEmail("")
    setSubject("")
    setShowAIEnhancement(false)
    setIsAIEnhanced(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }
    
    setIsProcessingOCR(true)
    
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              // You could show progress here if needed
            }
          }
        }
      )
      
      const extractedText = result.data.text.trim()
      
      if (extractedText) {
        setText(extractedText)
        toast({
          title: "Text Extracted",
          description: "Text has been extracted from the image",
        })
      } else {
        toast({
          title: "No Text Found",
          description: "No text could be extracted from the image",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "OCR Failed",
        description: "Failed to extract text from image",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOCR(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCopyReport = () => {
    if (!result) return
    
    const report = `
ScamShield Analysis Report
--------------------------
Risk Score: ${result.riskScore}%
Risk Level: ${result.riskLevel ? riskConfig[result.riskLevel].label : "N/A"}
Scam Type: ${result.scamType && result.scamType !== "unknown" ? scamTypeLabels[result.scamType] : "N/A"}
Confidence: ${result.confidence}%
Languages: ${result.detectedLanguages.join(', ')}

Red Flags:
${result.redFlags.map(f => `- ${f}`).join("\n")}

Recommendations:
${result.recommendations.map(r => `- ${r}`).join("\n")}
    `.trim()
    
    navigator.clipboard.writeText(report)
    toast({
      title: "Report Copied",
      description: "Analysis report copied to clipboard",
    })
  }

  const handleDownloadPDF = () => {
    if (!result) return
    
    const pdf = new jsPDF()
    
    // Set up the PDF
    pdf.setFontSize(20)
    pdf.text('ScamShield Analysis Report', 20, 30)
    
    pdf.setFontSize(12)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45)
    
    // Risk Score
    pdf.setFontSize(14)
    pdf.text('Risk Assessment:', 20, 65)
    pdf.setFontSize(12)
    pdf.text(`Risk Score: ${result.riskScore}%`, 30, 80)
    pdf.text(`Risk Level: ${result.riskLevel ? riskConfig[result.riskLevel].label : "N/A"}`, 30, 90)
    pdf.text(`Scam Type: ${result.scamType && result.scamType !== "unknown" ? scamTypeLabels[result.scamType] : "N/A"}`, 30, 100)
    pdf.text(`Confidence: ${result.confidence}%`, 30, 110)
    
    // Languages detected
    if (result.detectedLanguages.length > 0) {
      pdf.text(`Languages: ${result.detectedLanguages.join(', ')}`, 30, 120)
    }
    
    // Original text
    pdf.setFontSize(14)
    pdf.text('Analyzed Text:', 20, 140)
    pdf.setFontSize(10)
    const splitText = pdf.splitTextToSize(text, 170)
    let yPosition = 150
    splitText.forEach((line: string) => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(line, 30, yPosition)
      yPosition += 7
    })
    
    // Red flags
    if (result.redFlags.length > 0) {
      pdf.addPage()
      pdf.setFontSize(14)
      pdf.text('Red Flags Detected:', 20, 30)
      pdf.setFontSize(10)
      yPosition = 45
      result.redFlags.forEach((flag) => {
        if (yPosition > 270) {
          pdf.addPage()
          yPosition = 20
        }
        const splitFlag = pdf.splitTextToSize(`• ${flag}`, 170)
        splitFlag.forEach((line: string) => {
          pdf.text(line, 30, yPosition)
          yPosition += 7
        })
      })
    }
    
    // Recommendations
    pdf.addPage()
    pdf.setFontSize(14)
    pdf.text('Recommendations:', 20, 30)
    pdf.setFontSize(10)
    yPosition = 45
    result.recommendations.forEach((rec) => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
      const splitRec = pdf.splitTextToSize(`• ${rec}`, 170)
      splitRec.forEach((line: string) => {
        pdf.text(line, 30, yPosition)
        yPosition += 7
      })
    })
    
    // Save the PDF
    pdf.save(`scamshield-analysis-${Date.now()}.pdf`)
    
    toast({
      title: "PDF Downloaded",
      description: "Analysis report has been downloaded",
    })
  }

  const config = result?.riskLevel ? riskConfig[result.riskLevel] : null
  const RiskIcon = config?.icon || Shield

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Email Analysis Toggle */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailFields(!showEmailFields)}
              className="gap-2 border-border bg-transparent hover:bg-secondary"
            >
              <Mail className="h-4 w-4" />
              {showEmailFields ? 'Hide Email Fields' : 'Analyze Email Headers'}
            </Button>
          </div>

          {/* Email Fields */}
          {showEmailFields && (
            <div className="mb-6 space-y-4 rounded-lg border border-border bg-surface p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Sender Email (Optional)</label>
                <input
                  type="email"
                  placeholder="sender@example.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-3 pr-4 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject (Optional)</label>
                <input
                  type="text"
                  placeholder="Email subject line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-3 pr-4 text-sm placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* AI Enhancement Toggle */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIEnhancement(!showAIEnhancement)}
              className={`gap-2 ${showAIEnhancement ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-transparent hover:bg-secondary'}`}
            >
              🤖 {showAIEnhancement ? 'AI Enhancement Enabled' : 'Enable AI Enhancement'}
            </Button>
            {showAIEnhancement && (
              <p className="mt-2 text-xs text-muted-foreground">
                Uses AI for detailed analysis of borderline cases. Falls back to local analysis if AI is unavailable.
              </p>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Scan Message
            </h1>
            <p className="mt-2 text-muted-foreground">
              Paste any suspicious message to analyze its risk level
            </p>
          </div>

          {/* Input Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp, email, or message here..."
              className="min-h-[160px] w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
            />
            
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border bg-transparent hover:bg-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingOCR}
              >
                {isProcessingOCR ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Screenshot
                  </>
                )}
              </Button>
              
              <div className="flex-1" />
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="gap-2 border-border bg-transparent hover:bg-secondary"
                disabled={!text && !result}
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
              
              <Button 
                size="sm" 
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    Analyze Text
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-4">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Analyzing message...</p>
            </div>
          )}

          {/* Result Card */}
          {result && !isAnalyzing && (
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              {/* Enhanced Risk Score Circle with Weighted Factors */}
              <div className="flex flex-col items-center">
                <div className={`relative flex h-40 w-40 items-center justify-center rounded-full border-4 ${config?.borderColor} ${config?.bgColor}`}>
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${config?.color}`}>
                      {result.riskScore}%
                    </span>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                  {/* Confidence indicator */}
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background border-2 border-border p-1">
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <span className={result.confidence >= 80 ? "text-success" : result.confidence >= 60 ? "text-warning" : "text-danger"}>
                        {result.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Risk Badge */}
                <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${config?.bgColor}`}>
                  <RiskIcon className={`h-4 w-4 ${config?.color}`} />
                  <span className={`text-sm font-medium ${config?.color}`}>
                    {config?.label}
                  </span>
                </div>

                {/* Scam Type Badge */}
                {result.scamType && result.scamType !== "unknown" && (
                  <div className="mt-3 rounded-full border border-border bg-surface px-4 py-1.5">
                    <span className="text-sm text-muted-foreground">
                      {scamTypeLabels[result.scamType]}
                    </span>
                  </div>
                )}

                {/* AI Enhancement Badge */}
                {(result as any).aiEnhanced && (
                  <div className="mt-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                    <span className="text-sm text-primary flex items-center gap-1">
                      🤖 AI Enhanced
                      {(result as any).aiProvider && (
                        <span className="text-xs">({(result as any).aiProvider})</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Weighted Risk Factors */}
              {result.redFlags.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-danger">Risk Factor Analysis</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-danger" />
                      <span>Critical</span>
                      <div className="w-2 h-2 rounded-full bg-warning ml-2" />
                      <span>Warning</span>
                      <div className="w-2 h-2 rounded-full bg-info ml-2" />
                      <span>Suspicious</span>
                    </div>
                  </div>
                  
                  {/* Group red flags by severity */}
                  <div className="space-y-4">
                    {/* Critical Risk Factors */}
                    {(() => {
                      const criticalFlags = result.redFlags.filter(flag => 
                        flag.toLowerCase().includes('urgent') ||
                        flag.toLowerCase().includes('immediately') ||
                        flag.toLowerCase().includes('verify') ||
                        flag.toLowerCase().includes('suspended') ||
                        flag.toLowerCase().includes('legal') ||
                        flag.toLowerCase().includes('arrest') ||
                        flag.toLowerCase().includes('password') ||
                        flag.toLowerCase().includes('credit card') ||
                        flag.toLowerCase().includes('bank account') ||
                        flag.toLowerCase().includes('social security')
                      )
                      
                      if (criticalFlags.length === 0) return null
                      
                      return (
                        <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 text-danger" />
                            <h4 className="text-sm font-medium text-danger">Critical Risk Factors ({criticalFlags.length})</h4>
                          </div>
                          <ul className="space-y-2">
                            {criticalFlags.map((flag, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0" />
                                <span className="text-foreground font-medium">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                    
                    {/* Warning Risk Factors */}
                    {(() => {
                      const warningFlags = result.redFlags.filter(flag => 
                        !flag.toLowerCase().includes('urgent') &&
                        !flag.toLowerCase().includes('immediately') &&
                        !flag.toLowerCase().includes('verify') &&
                        !flag.toLowerCase().includes('suspended') &&
                        !flag.toLowerCase().includes('legal') &&
                        !flag.toLowerCase().includes('arrest') &&
                        !flag.toLowerCase().includes('password') &&
                        !flag.toLowerCase().includes('credit card') &&
                        !flag.toLowerCase().includes('bank account') &&
                        !flag.toLowerCase().includes('social security') &&
                        (
                          flag.toLowerCase().includes('money') ||
                          flag.toLowerCase().includes('send') ||
                          flag.toLowerCase().includes('transfer') ||
                          flag.toLowerCase().includes('payment') ||
                          flag.toLowerCase().includes('account') ||
                          flag.toLowerCase().includes('click') ||
                          flag.toLowerCase().includes('link') ||
                          flag.toLowerCase().includes('limited') ||
                          flag.toLowerCase().includes('offer')
                        )
                      )
                      
                      if (warningFlags.length === 0) return null
                      
                      return (
                        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <h4 className="text-sm font-medium text-warning">Warning Factors ({warningFlags.length})</h4>
                          </div>
                          <ul className="space-y-2">
                            {warningFlags.map((flag, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                                <span className="text-foreground">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                    
                    {/* Suspicious Factors */}
                    {(() => {
                      const suspiciousFlags = result.redFlags.filter(flag => 
                        !flag.toLowerCase().includes('urgent') &&
                        !flag.toLowerCase().includes('immediately') &&
                        !flag.toLowerCase().includes('verify') &&
                        !flag.toLowerCase().includes('suspended') &&
                        !flag.toLowerCase().includes('legal') &&
                        !flag.toLowerCase().includes('arrest') &&
                        !flag.toLowerCase().includes('password') &&
                        !flag.toLowerCase().includes('credit card') &&
                        !flag.toLowerCase().includes('bank account') &&
                        !flag.toLowerCase().includes('social security') &&
                        !flag.toLowerCase().includes('money') &&
                        !flag.toLowerCase().includes('send') &&
                        !flag.toLowerCase().includes('transfer') &&
                        !flag.toLowerCase().includes('payment') &&
                        !flag.toLowerCase().includes('account') &&
                        !flag.toLowerCase().includes('click') &&
                        !flag.toLowerCase().includes('link') &&
                        !flag.toLowerCase().includes('limited') &&
                        !flag.toLowerCase().includes('offer')
                      )
                      
                      if (suspiciousFlags.length === 0) return null
                      
                      return (
                        <div className="rounded-lg border border-info/30 bg-info/10 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="h-4 w-4 text-info" />
                            <h4 className="text-sm font-medium text-info">Suspicious Indicators ({suspiciousFlags.length})</h4>
                          </div>
                          <ul className="space-y-2">
                            {suspiciousFlags.map((flag, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-info mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Enhanced Recommendations with Priority */}
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Recommended Actions</h3>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${result.riskScore >= 70 ? 'bg-danger' : result.riskScore >= 40 ? 'bg-warning' : 'bg-success'}`} />
                    <span className="text-xs text-muted-foreground">
                      {result.riskScore >= 70 ? 'Immediate' : result.riskScore >= 40 ? 'Recommended' : 'Advisory'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => {
                    const isCritical = rec.toLowerCase().includes('immediately') || 
                                    rec.toLowerCase().includes('delete') || 
                                    rec.toLowerCase().includes('block') ||
                                    rec.toLowerCase().includes('report') ||
                                    rec.toLowerCase().includes('change')
                    
                    return (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${isCritical ? 'border-danger/30 bg-danger/10' : 'border-border bg-surface'}`}>
                        <div className={`mt-0.5 flex-shrink-0 ${isCritical ? 'text-danger' : 'text-success'}`}>
                          {isCritical ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className={`text-sm ${isCritical ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {rec}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Enhanced Analysis Summary */}
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-sm font-medium text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analysis Summary
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <span className={`text-sm font-medium ${config?.color}`}>
                        {config?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <span className={`text-sm font-medium ${result.confidence >= 80 ? 'text-success' : result.confidence >= 60 ? 'text-warning' : 'text-danger'}`}>
                        {result.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Threat Type</span>
                      <span className="text-sm font-medium text-foreground">
                        {result.scamType && result.scamType !== "unknown" ? scamTypeLabels[result.scamType] : "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk Factors</span>
                      <span className="text-sm font-medium text-foreground">
                        {result.redFlags.length} detected
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <span className="text-sm font-medium text-foreground">
                        {result.detectedLanguages.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Analysis</span>
                      <span className="text-sm font-medium text-foreground">
                        {(result as any).aiEnhanced ? 'AI Enhanced' : 'Local Engine'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyReport}
                  className="gap-2 border-border bg-transparent hover:bg-secondary"
                >
                  <Copy className="h-4 w-4" />
                  Copy Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadPDF}
                  className="gap-2 border-border bg-transparent hover:bg-secondary"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleClear}
                  className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  <RefreshCw className="h-4 w-4" />
                  Scan Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
