"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, AlertTriangle, Shield, Clock, ArrowRight, TrendingUp, PieChart, Activity, ArrowLeft, TrendingDown, Users, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { storage } from '@/lib/storage'
import { withAuth } from '@/contexts/auth-context'

const defaultStats = [
  {
    title: "Total Analyses",
    value: "—",
    subtitle: "No data yet",
    icon: BarChart3,
  },
  {
    title: "High Risk Messages",
    value: "—",
    subtitle: "No data yet",
    icon: AlertTriangle,
  },
  {
    title: "Top Scam Type",
    value: "—",
    subtitle: "No data yet",
    icon: Shield,
  },
  {
    title: "Recent Checks",
    value: "—",
    subtitle: "No data yet",
    icon: Clock,
  },
]

function DashboardPage() {
  const [stats, setStats] = useState<any>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await storage.getStats()
        
        setStats({
          ...statsData,
          statsCards: [
            {
              title: "Total Analyses",
              value: statsData.totalAnalyses.toString(),
              subtitle: "All time scans",
              icon: BarChart3,
            },
            {
              title: "High Risk Messages",
              value: statsData.highRiskMessages.toString(),
              subtitle: "Threats detected",
              icon: AlertTriangle,
            },
            {
              title: "Top Scam Type",
              value: statsData.topScamType.charAt(0).toUpperCase() + statsData.topScamType.slice(1).replace('-', ' '),
              subtitle: "Most common threat",
              icon: Shield,
            },
            {
              title: "Recent Checks",
              value: statsData.recentChecks.toString(),
              subtitle: "Last 7 days",
              icon: Clock,
            },
          ]
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Back Button */}
          <Link 
            href="/" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Overview of your scam analysis activity
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex h-4 w-20 animate-pulse rounded bg-surface" />
                  <div className="mt-2 h-8 w-12 animate-pulse rounded bg-surface" />
                  <div className="mt-1 h-3 w-24 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4">
              <p className="text-sm text-danger">{error}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.statsCards?.map((stat: any) => (
                <div 
                  key={stat.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Analytics Charts */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Real Trend Chart */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-medium">7-Day Activity Trend</h2>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              {stats.trendData && stats.trendData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex h-32 items-end justify-between gap-2">
                    {stats.trendData.slice(-7).map((day: any, index: number) => {
                      const maxAnalyses = Math.max(...stats.trendData.map((d: any) => d.analyses))
                      const height = maxAnalyses > 0 ? (day.analyses / maxAnalyses) * 100 : 0
                      const threatHeight = maxAnalyses > 0 ? (day.threats / maxAnalyses) * 100 : 0
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="w-full flex flex-col-reverse gap-1" style={{ height: '100px' }}>
                            <div 
                              className="w-full bg-danger rounded-t"
                              style={{ height: `${threatHeight}%` }}
                              title={`${day.threats} threats`}
                            />
                            <div 
                              className="w-full bg-primary rounded-b"
                              style={{ height: `${height - threatHeight}%` }}
                              title={`${day.analyses} total analyses`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded" />
                      <span className="text-muted-foreground">Total Scans</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-danger rounded" />
                      <span className="text-muted-foreground">Threats</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center">
                  <div className="h-32 w-full rounded-lg bg-surface" />
                  <p className="mt-2 text-xs text-muted-foreground">No activity data yet</p>
                </div>
              )}
            </div>

            {/* Real Category Distribution */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-medium">Scam Type Distribution</h2>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
              {stats.categoryData && stats.categoryData.length > 0 ? (
                <div className="space-y-3">
                  {stats.categoryData.slice(0, 5).map((category: any, index: number) => {
                    const colors = ['bg-primary', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success']
                    const color = colors[index % colors.length]
                    
                    return (
                      <div key={category.category} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.category}</span>
                            <span className="text-sm text-muted-foreground">{category.count}</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2">
                            <div 
                              className={`${color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-surface" />
                  <p className="mt-2 text-xs text-muted-foreground">No category data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Recent Scans</h2>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((item: any, index: number) => {
                  const riskConfig = {
                    "safe": { color: "text-success", bgColor: "bg-success/10", label: "Safe" },
                    "suspicious": { color: "text-warning", bgColor: "bg-warning/10", label: "Suspicious" },
                    "high-risk": { color: "text-danger", bgColor: "bg-danger/10", label: "High Risk" },
                    "likely-scam": { color: "text-danger", bgColor: "bg-danger/10", label: "Likely Scam" },
                  }
                  
                  const config = riskConfig[item.risk_level as keyof typeof riskConfig] || riskConfig.safe
                  const date = new Date(item.created_at || item.date)
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.text ? item.text.substring(0, 60) + (item.text.length > 60 ? '...' : '') : 'No text'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold">{item.risk_score || 0}%</p>
                        <p className="text-xs text-muted-foreground">Risk</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Paste a suspicious message to see your dashboard come to life with insights and analytics
                </p>
                <Link href="/scan">
                  <Button className="mt-4 gap-2 bg-foreground text-background hover:bg-foreground/90">
                    Start Scanning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Stats Summary */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Accuracy</span>
              </div>
              <p className="text-2xl font-semibold">{stats.protectionScore || 0}%</p>
              <p className="text-xs text-muted-foreground mt-1">Protection Score</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-5 w-5 text-warning" />
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>
              <p className="text-2xl font-semibold">{stats.recentChecks || 0}</p>
n              <p className="text-xs text-muted-foreground mt-1">Scans Completed</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-xs text-muted-foreground">Safe</span>
              </div>
              <p className="text-2xl font-semibold">{stats.safeMessages || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Safe Messages</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span className="text-xs text-muted-foreground">Threats</span>
              </div>
              <p className="text-2xl font-semibold">{stats.threatsDetected || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Threats Blocked</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default withAuth(DashboardPage)
