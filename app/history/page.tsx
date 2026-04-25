"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { History, ArrowRight, Search, Filter, FileText, ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, XCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { storage } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { withAuth } from '@/contexts/auth-context'

interface HistoryItem {
  id: string
  date: string
  text: string
  riskScore: number
  riskLevel: 'safe' | 'suspicious' | 'high-risk' | 'likely-scam'
  scamType: string
  redFlags: string[]
  recommendations: string[]
  detectedLanguages: string[]
  confidence: number
}

const riskConfig = {
  "safe": { label: "Safe", color: "text-success", bgColor: "bg-success/10" },
  "suspicious": { label: "Suspicious", color: "text-warning", bgColor: "bg-warning/10" },
  "high-risk": { label: "High Risk", color: "text-danger", bgColor: "bg-danger/10" },
  "likely-scam": { label: "Likely Scam", color: "text-danger", bgColor: "bg-danger/10" },
}

const scamTypeLabels: Record<string, string> = {
  "phishing": "Phishing",
  "fake-job": "Fake Job",
  "loan-scam": "Loan Scam",
  "bank-fraud": "Bank Fraud",
  "investment-scam": "Investment Scam",
  "otp-theft": "OTP Theft",
  "unknown": "Unknown",
}

function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await storage.getHistory()
        setHistory(historyData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getRiskConfig = (riskLevel?: string | null) => {
    if (!riskLevel) return riskConfig["safe"];
    
    const normalizedLevel = riskLevel.toString().trim().toLowerCase();
    
    const levelMap: Record<string, keyof typeof riskConfig> = {
      "safe": "safe",
      "suspicious": "suspicious", 
      "high-risk": "high-risk",
      "highrisk": "high-risk",
      "high risk": "high-risk",
      "likely-scam": "likely-scam",
      "likelyscam": "likely-scam",
      "likely scam": "likely-scam"
    };
    
    const mappedLevel = levelMap[normalizedLevel];
    return riskConfig[mappedLevel] || riskConfig["safe"];
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await storage.deleteItem(id)
      setHistory(history.filter(item => item.id !== id))
      toast({
        title: "Item Deleted",
        description: "Analysis has been removed from history",
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      return
    }
    
    try {
      await storage.clearHistory()
      setHistory([])
      toast({
        title: "History Cleared",
        description: "All analysis history has been cleared",
      })
    } catch (err) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear history",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Back Button */}
          <Link 
            href="/dashboard" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Scan History
              </h1>
              <p className="mt-2 text-muted-foreground">
                View and manage your previous scam analyses
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border bg-transparent hover:bg-secondary"
                disabled
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border bg-transparent hover:bg-secondary"
                disabled
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              {history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="gap-2 border-danger/30 text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden rounded-t-xl border border-b-0 border-border bg-surface p-4 sm:block">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
              <div>Date</div>
              <div>Scam Type</div>
              <div>Risk Score</div>
              <div>Preview</div>
              <div className="text-right">Action</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="rounded-b-xl border border-border bg-card sm:rounded-t-none">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Loading history...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-b-xl border border-border bg-card sm:rounded-t-none">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && history.length === 0 && (
            <div className="rounded-b-xl border border-border bg-card sm:rounded-t-none">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-surface p-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mt-6 text-lg font-medium">No Scans Yet</h2>
                <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                  Your scan history will appear here once you analyze your first message
                </p>
                <Link href="/scan">
                  <Button className="mt-6 gap-2 bg-foreground text-background hover:bg-foreground/90">
                    Start Scanning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* History Items */}
          {!loading && !error && history.length > 0 && (
            <div className="rounded-b-xl border border-border bg-card sm:rounded-t-none">
              {history.map((item) => (
                <div key={item.id} className="border-b border-border last:border-b-0">
                  <div className="grid gap-4 p-4 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-muted-foreground sm:hidden">Date</p>
                      <p className="text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground sm:hidden">Scam Type</p>
                      {item.scamType ? (
                        <span className="inline-flex rounded-full bg-danger/10 px-2.5 py-0.5 text-xs text-danger">
                          {scamTypeLabels[item.scamType] || item.scamType}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-success/10 px-2.5 py-0.5 text-xs text-success">
                          Safe
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground sm:hidden">Risk Score</p>
                      <span className={`text-sm font-medium ${getRiskConfig(item.riskLevel)?.color || 'text-muted-foreground'}`}>
                        {item.riskScore}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground sm:hidden">Preview</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.text.substring(0, 50)}...
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedItem(item)}
                          className="border-border bg-transparent hover:bg-secondary"
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteItem(item.id)}
                          className="border-danger/30 text-danger hover:bg-danger/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Details Modal */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Analysis Details</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedItem(null)}
                    className="border-border bg-transparent hover:bg-secondary"
                  >
                    Close
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedItem.date).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="mt-1 rounded-lg border border-border bg-surface p-3 text-sm">
                      {selectedItem.text}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className={`text-2xl font-semibold ${getRiskConfig(selectedItem.riskLevel)?.color || 'text-muted-foreground'}`}>
                        {selectedItem.riskScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRiskConfig(selectedItem.riskLevel)?.bgColor || 'bg-surface'} ${getRiskConfig(selectedItem.riskLevel)?.color || 'text-muted-foreground'}`}>
                        {getRiskConfig(selectedItem.riskLevel)?.label || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedItem.scamType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Scam Type</p>
                      <span className="inline-flex rounded-full bg-danger/10 px-3 py-1 text-sm text-danger">
                        {scamTypeLabels[selectedItem.scamType] || selectedItem.scamType}
                      </span>
                    </div>
                  )}
                  
                  {selectedItem.redFlags.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-danger">Red Flags</p>
                      <ul className="space-y-1">
                        {selectedItem.redFlags.map((flag, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <p className="mb-2 text-sm font-medium">Recommendations</p>
                    <ul className="space-y-1">
                      {selectedItem.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(HistoryPage)
