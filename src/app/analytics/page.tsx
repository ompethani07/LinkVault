'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import StaticLogo from '@/components/StaticLogo'
import Link from 'next/link'
import LoadingLink from '@/components/LoadingLink'

interface Link {
  id: string
  title: string
  url: string
  description: string
  category: string
  isFile?: boolean
  files?: any[]
  createdAt: Date
  views?: number
  clicks?: number
}

interface AnalyticsData {
  totalLinks: number
  totalViews: number
  totalClicks: number
  clickRate: number
  categoryStats: Record<string, number>
  recentLinks: Link[]
  monthlyLinks: number
}

export default function Analytics() {
  const { user } = useUser()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalLinks: 0,
    totalViews: 0,
    totalClicks: 0,
    clickRate: 0,
    categoryStats: {},
    recentLinks: [],
    monthlyLinks: 0
  })

  // Load analytics data from API on mount
  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(220, 38, 38, 0.03) 50%, transparent 60%)
            `
          }}
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <StaticLogo size={52} />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    LinkVault
                  </h1>
                  <p className="text-xs text-gray-500 tracking-wide">ANALYTICS</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="h-6 w-px bg-gray-700"></div>
                <nav className="flex space-x-6">
                  <LoadingLink href="/dashboard" className="text-gray-400 hover:text-red-400 transition-colors">Dashboard</LoadingLink>
                  <LoadingLink href="/analytics" className="text-red-400 font-medium">Analytics</LoadingLink>
                  <LoadingLink href="/settings" className="text-gray-400 hover:text-red-400 transition-colors">Settings</LoadingLink>
                  <LoadingLink href="/pricing" className="text-gray-400 hover:text-red-400 transition-colors">Pricing</LoadingLink>
                </nav>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-300 font-medium">Welcome back,</p>
                <p className="text-lg font-bold text-white">{user?.firstName}</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Links</p>
                <p className="text-3xl font-bold text-white mt-1">{analyticsData.totalLinks}</p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-white mt-1">{analyticsData.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-white mt-1">{analyticsData.totalClicks}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Click Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{analyticsData.clickRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Analytics */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Links by Category</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 capitalize font-medium">{category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(count / analyticsData.totalLinks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Links */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Recent Links</h3>
            <div className="space-y-4">
              {analyticsData.recentLinks.length > 0 ? (
                analyticsData.recentLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="text-white font-medium truncate">{link.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{link.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-300 text-sm">{link.views || 0} views</p>
                      <p className="text-gray-400 text-xs">{link.clicks || 0} clicks</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No links created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Performance Overview</h3>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400 text-lg font-medium">Charts Coming Soon</p>
                <p className="text-gray-500 text-sm">Interactive analytics charts will be available here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
