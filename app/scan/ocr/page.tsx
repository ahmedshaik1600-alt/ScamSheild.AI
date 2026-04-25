"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ScanOCRPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      setIsProcessing(true)
      // Simulate OCR processing and redirect to scan page
      setTimeout(() => {
        setIsProcessing(false)
        // Redirect to scan page with extracted text
        window.location.href = '/scan?from=ocr&text=Sample+extracted+text+from+screenshot'
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back Button */}
          <Link 
            href="/tools" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Screenshot OCR Upload
            </h1>
            <p className="mt-4 text-muted-foreground">
              Upload a screenshot and we'll extract text for scam analysis using advanced OCR technology
            </p>
          </div>

          {/* Upload Area */}
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Upload Screenshot</h3>
              <p className="text-sm text-muted-foreground">
                Supports PNG, JPG, and WEBP formats
              </p>
            </div>

            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-sm file:mr-4 file:cursor-pointer"
                disabled={isProcessing}
              />
              
              {selectedFile && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent border-r-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Processing image...
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={handleAnalyze}
              disabled={!selectedFile || isProcessing}
              size="lg"
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4" />
              {isProcessing ? 'Extracting Text...' : 'Extract & Analyze'}
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded-lg border border-border/30 bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning flex-shrink-0" />
              <div>
                <h4 className="font-medium">How it works:</h4>
                <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Upload your screenshot using the button above</li>
                  <li>Our OCR technology extracts text from the image</li>
                  <li>You'll be redirected to the scan page for analysis</li>
                  <li>Get detailed scam risk assessment and recommendations</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
