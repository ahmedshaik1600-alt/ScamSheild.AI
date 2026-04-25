import { supabase } from './supabase'

// Storage interface for compatibility between localStorage and Supabase
export interface StorageAdapter {
  getHistory(): Promise<any[]>
  saveAnalysis(analysis: any): Promise<void>
  getStats(): Promise<any>
  clearHistory(): Promise<void>
  deleteItem(id: string): Promise<void>
}

// LocalStorage implementation
export class LocalStorageAdapter implements StorageAdapter {
  private readonly HISTORY_KEY = 'scamshield_history'
  private readonly STATS_KEY = 'scamshield_stats'

  async getHistory(): Promise<any[]> {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get history from localStorage:', error)
      return []
    }
  }

  async saveAnalysis(analysis: any): Promise<void> {
    if (typeof window === 'undefined') return
    
    try {
      const history = await this.getHistory()
      const newAnalysis = {
        ...analysis,
        id: Date.now().toString(),
        date: new Date().toISOString()
      }
      
      history.unshift(newAnalysis)
      
      // Keep only last 1000 items to prevent storage overflow
      if (history.length > 1000) {
        history.splice(1000)
      }
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history))
      await this.updateStats()
    } catch (error) {
      console.error('Failed to save analysis to localStorage:', error)
    }
  }

  async getStats(): Promise<any> {
    if (typeof window === 'undefined') return this.getDefaultStats()
    
    try {
      const stored = localStorage.getItem(this.STATS_KEY)
      if (stored) return JSON.parse(stored)
      
      // Calculate stats from history if not cached
      const history = await this.getHistory()
      const stats = this.calculateStats(history)
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats))
      return stats
    } catch (error) {
      console.error('Failed to get stats from localStorage:', error)
      return this.getDefaultStats()
    }
  }

  async clearHistory(): Promise<void> {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.HISTORY_KEY)
      localStorage.removeItem(this.STATS_KEY)
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error)
    }
  }

  async deleteItem(id: string): Promise<void> {
    if (typeof window === 'undefined') return
    
    try {
      const history = await this.getHistory()
      const filtered = history.filter(item => item.id !== id)
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered))
      await this.updateStats()
    } catch (error) {
      console.error('Failed to delete item from localStorage:', error)
    }
  }

  private async updateStats(): Promise<void> {
    const history = await this.getHistory()
    const stats = this.calculateStats(history)
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats))
  }

  private calculateStats(history: any[]): any {
    const totalAnalyses = history.length
    const highRiskMessages = history.filter(item => 
      item.riskLevel === 'high-risk' || item.riskLevel === 'likely-scam'
    ).length

    // Calculate top scam type
    const scamTypeCounts: Record<string, number> = {}
    history.forEach(item => {
      if (item.scamType) {
        scamTypeCounts[item.scamType] = (scamTypeCounts[item.scamType] || 0) + 1
      }
    })
    
    const topScamType = Object.keys(scamTypeCounts).reduce((a, b) => 
      scamTypeCounts[a] > scamTypeCounts[b] ? a : b, 'unknown'
    )

    // Calculate recent checks (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentChecks = history.filter(item => 
      new Date(item.date) > sevenDaysAgo
    ).length

    // Generate trend data
    const trendData = this.generateTrendData(history)
    
    // Generate category data
    const categoryData = this.generateCategoryData(scamTypeCounts)

    // Recent activity
    const recentActivity = history.slice(0, 5)

    return {
      totalAnalyses,
      highRiskMessages,
      topScamType,
      recentChecks,
      threatsDetected: highRiskMessages,
      safeMessages: totalAnalyses - highRiskMessages,
      protectionScore: totalAnalyses > 0 ? Math.max(0, 100 - Math.round((highRiskMessages / totalAnalyses) * 100)) : 0,
      trendData,
      categoryData,
      recentActivity
    }
  }

  private generateTrendData(history: any[]): any[] {
    const trendData: any[] = []
    const today = new Date()
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayAnalyses = history.filter(item => 
        item.date.startsWith(dateStr)
      )
      
      const dayThreats = dayAnalyses.filter(item => 
        item.riskLevel === 'high-risk' || item.riskLevel === 'likely-scam'
      )
      
      trendData.push({
        date: dateStr,
        analyses: dayAnalyses.length,
        threats: dayThreats.length
      })
    }
    
    return trendData
  }

  private generateCategoryData(scamTypeCounts: Record<string, number>): any[] {
    const total = Object.values(scamTypeCounts).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(scamTypeCounts).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
  }

  private getDefaultStats(): any {
    return {
      totalAnalyses: 0,
      highRiskMessages: 0,
      topScamType: 'unknown',
      recentChecks: 0,
      threatsDetected: 0,
      safeMessages: 0,
      protectionScore: 0,
      trendData: [],
      categoryData: [],
      recentActivity: []
    }
  }
}

// Supabase implementation
export class SupabaseAdapter implements StorageAdapter {
  async getHistory(): Promise<any[]> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map database fields to UI expected format
      return (data || []).map(item => ({
        id: item.id,
        date: item.created_at,
        text: item.text,
        riskScore: item.risk_score,
        riskLevel: item.risk_level,
        scamType: item.scam_type,
        redFlags: item.red_flags || [],
        recommendations: item.recommendations || [],
        detectedLanguages: item.detected_languages || [],
        confidence: item.confidence,
        senderEmail: item.sender_email,
        subject: item.subject
      }))
    } catch (error) {
      console.error('Failed to get history from Supabase:', error)
      return []
    }
  }

  async saveAnalysis(analysis: any): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('scan_history')
        .insert({
          user_id: user.id,
          text: analysis.text || '',
          risk_level: analysis.riskLevel || 'safe',
          risk_score: analysis.riskScore || 0,
          scam_type: analysis.scamType || 'unknown',
          red_flags: analysis.redFlags || [],
          recommendations: analysis.recommendations || [],
          detected_languages: analysis.detectedLanguages || [],
          confidence: analysis.confidence || 0,
          sender_email: analysis.senderEmail || null,
          subject: analysis.subject || null,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
    } catch (error) {
      console.error('Failed to save analysis to Supabase:', error)
    }
  }

  async getStats(): Promise<any> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      // Get all user's scans
      const { data: history, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Map database fields to expected format for stats calculation
      const mappedHistory = (history || []).map(item => ({
        risk_level: item.risk_level,
        scam_type: item.scam_type,
        created_at: item.created_at
      }))
      
      return this.calculateStats(mappedHistory)
    } catch (error) {
      console.error('Failed to get stats from Supabase:', error)
      return this.getDefaultStats()
    }
  }

  async clearHistory(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', user.id)
      
      if (error) throw error
    } catch (error) {
      console.error('Failed to clear history from Supabase:', error)
    }
  }

  async deleteItem(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      
      if (error) throw error
    } catch (error) {
      console.error('Failed to delete item from Supabase:', error)
    }
  }

  private calculateStats(history: any[]): any {
    const totalAnalyses = history.length
    const highRiskMessages = history.filter(item => 
      item.risk_level === 'high-risk' || item.risk_level === 'likely-scam'
    ).length

    // Calculate top scam type
    const scamTypeCounts: Record<string, number> = {}
    history.forEach(item => {
      if (item.scam_type) {
        scamTypeCounts[item.scam_type] = (scamTypeCounts[item.scam_type] || 0) + 1
      }
    })
    
    const topScamType = Object.keys(scamTypeCounts).reduce((a, b) => 
      scamTypeCounts[a] > scamTypeCounts[b] ? a : b, 'unknown'
    )

    // Calculate recent checks (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentChecks = history.filter(item => 
      new Date(item.created_at) > sevenDaysAgo
    ).length

    // Generate trend data
    const trendData = this.generateTrendData(history)
    
    // Generate category data
    const categoryData = this.generateCategoryData(scamTypeCounts)

    // Recent activity
    const recentActivity = history.slice(0, 5)

    return {
      totalAnalyses,
      highRiskMessages,
      topScamType,
      recentChecks,
      threatsDetected: highRiskMessages,
      safeMessages: totalAnalyses - highRiskMessages,
      protectionScore: totalAnalyses > 0 ? Math.max(0, 100 - Math.round((highRiskMessages / totalAnalyses) * 100)) : 0,
      trendData,
      categoryData,
      recentActivity
    }
  }

  private generateTrendData(history: any[]): any[] {
    const trendData: any[] = []
    const today = new Date()
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayAnalyses = history.filter(item => 
        item.created_at.startsWith(dateStr)
      )
      
      const dayThreats = dayAnalyses.filter(item => 
        item.risk_level === 'high-risk' || item.risk_level === 'likely-scam'
      )
      
      trendData.push({
        date: dateStr,
        analyses: dayAnalyses.length,
        threats: dayThreats.length
      })
    }
    
    return trendData
  }

  private generateCategoryData(scamTypeCounts: Record<string, number>): any[] {
    const total = Object.values(scamTypeCounts).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(scamTypeCounts).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
  }

  private getDefaultStats(): any {
    return {
      totalAnalyses: 0,
      highRiskMessages: 0,
      topScamType: 'unknown',
      recentChecks: 0,
      threatsDetected: 0,
      safeMessages: 0,
      protectionScore: 0,
      trendData: [],
      categoryData: [],
      recentActivity: []
    }
  }
}

// Auth interface for compatibility between localStorage and Supabase
export interface AuthAdapter {
  signIn(email: string, password: string): Promise<any>
  signUp(email: string, password: string, name?: string): Promise<any>
  signOut(): Promise<void>
  getCurrentUser(): Promise<any>
  onAuthChange(callback: (user: any) => void): () => void
}

// Supabase auth implementation
export class SupabaseAuthAdapter implements AuthAdapter {
  async signIn(email: string, password: string): Promise<any> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data.user
  }

  async signUp(email: string, password: string, name?: string): Promise<any> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })
    
    if (error) throw error
    return data.user
  }

  async signOut(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<any> {
    if (!supabase) return null
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  onAuthChange(callback: (user: any) => void): () => void {
    if (!supabase) {
      // Return no-op unsubscribe function
      return () => {}
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user || null)
      }
    )
    
    return () => subscription.unsubscribe()
  }
}

// Mock auth implementation (fallback)
export class MockAuthAdapter implements AuthAdapter {
  private currentUser: any = null
  private listeners: ((user: any) => void)[] = []

  async signIn(email: string, password: string): Promise<any> {
    // Mock authentication - accept any email/password
    this.currentUser = {
      id: 'mock-user-id',
      email,
      name: email.split('@')[0],
      created_at: new Date().toISOString()
    }
    
    this.notifyListeners()
    return this.currentUser
  }

  async signUp(email: string, password: string, name?: string): Promise<any> {
    // Mock sign up
    this.currentUser = {
      id: 'mock-user-id',
      email,
      name: name || email.split('@')[0],
      created_at: new Date().toISOString()
    }
    
    this.notifyListeners()
    return this.currentUser
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    this.notifyListeners()
  }

  async getCurrentUser(): Promise<any> {
    return this.currentUser
  }

  onAuthChange(callback: (user: any) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentUser))
  }
}

// Current storage instance - use Supabase if available, fallback to localStorage
export const storage = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? new SupabaseAdapter() 
  : new LocalStorageAdapter()

// Current auth instance - use Supabase if available, fallback to mock
export const auth = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? new SupabaseAuthAdapter() 
  : new MockAuthAdapter()
