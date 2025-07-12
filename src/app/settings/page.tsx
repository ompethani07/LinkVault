'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import StaticLogo from '@/components/StaticLogo'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import LoadingLink from '@/components/LoadingLink'
import SubscriptionManager from '@/components/SubscriptionManager'

interface Settings {
  theme: 'dark' | 'light'
  notifications: boolean
  publicProfile: boolean
  defaultCategory: string
  autoDelete: boolean
  autoDeleteDays: number
  linkExpiration: boolean
  linkExpirationDays: number
}

export default function Settings() {
  const { user } = useUser()
  const { theme: currentTheme, setTheme } = useTheme()
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    notifications: true,
    publicProfile: false,
    defaultCategory: 'work',
    autoDelete: false,
    autoDeleteDays: 30,
    linkExpiration: false,
    linkExpirationDays: 7
  })

  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load settings from server on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        // Apply theme from settings
        if (data.settings.theme && data.settings.theme !== currentTheme) {
          setTheme(data.settings.theme)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      // Fallback to localStorage if server fails
      const savedSettings = localStorage.getItem('linkVaultSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        localStorage.setItem('linkVaultSettings', JSON.stringify(settings))
        setTimeout(() => setSaved(false), 2000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Immediately apply theme changes
    if (key === 'theme') {
      setTheme(value)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL your links? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your links and data. Are you absolutely sure?')) {
      return
    }

    try {
      const response = await fetch('/api/settings/delete-all', {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully deleted ${data.deletedCount} links`)
        // You might want to redirect to dashboard or refresh the page
        window.location.href = '/dashboard'
      } else {
        throw new Error('Failed to delete links')
      }
    } catch (error) {
      console.error('Error deleting links:', error)
      alert('Failed to delete links. Please try again.')
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/settings/export')
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `linkvault-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to export data')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const categories = ['work', 'personal', 'resources', 'projects']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    )
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
                  <p className="text-xs text-gray-500 tracking-wide">SETTINGS</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="h-6 w-px bg-gray-700"></div>
                <nav className="flex space-x-6">
                  <LoadingLink href="/dashboard" className="text-gray-400 hover:text-red-400 transition-colors">Dashboard</LoadingLink>
                  <LoadingLink href="/analytics" className="text-gray-400 hover:text-red-400 transition-colors">Analytics</LoadingLink>
                  <LoadingLink href="/settings" className="text-red-400 font-medium">Settings</LoadingLink>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Subscription Management */}
          <SubscriptionManager />
          
          {/* Profile Settings */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Public Profile</h4>
                  <p className="text-gray-400 text-sm">Allow others to discover your public links</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.publicProfile}
                    onChange={(e) => updateSetting('publicProfile', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive updates about your links and activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Link Settings */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Link Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Category
                </label>
                <select
                  value={settings.defaultCategory}
                  onChange={(e) => updateSetting('defaultCategory', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Auto-delete old links</h4>
                  <p className="text-gray-400 text-sm">Automatically delete links after specified days</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoDelete}
                    onChange={(e) => updateSetting('autoDelete', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {settings.autoDelete && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto-delete after (days)
                  </label>
                  <input
                    type="number"
                    value={settings.autoDeleteDays}
                    onChange={(e) => updateSetting('autoDeleteDays', parseInt(e.target.value))}
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Link Expiration</h4>
                  <p className="text-gray-400 text-sm">Set expiration date for new links</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.linkExpiration}
                    onChange={(e) => updateSetting('linkExpiration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {settings.linkExpiration && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default expiration (days)
                  </label>
                  <input
                    type="number"
                    value={settings.linkExpirationDays}
                    onChange={(e) => updateSetting('linkExpirationDays', parseInt(e.target.value))}
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Appearance</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      (settings.theme === 'dark' || currentTheme === 'dark')
                        ? 'border-red-500 bg-red-950/20'
                        : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-900 rounded border border-gray-600"></div>
                      <span className="text-white font-medium">Dark</span>
                    </div>
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      (settings.theme === 'light' || currentTheme === 'light')
                        ? 'border-red-500 bg-red-950/20'
                        : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-white rounded border border-gray-300"></div>
                      <span className="text-white font-medium">Light</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-950/20 backdrop-blur-sm rounded-xl p-6 border border-red-900/50">
            <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Delete All Links</h4>
                  <p className="text-gray-400 text-sm">Permanently delete all your links and data</p>
                </div>
                <button 
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete All
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Export Data</h4>
                  <p className="text-gray-400 text-sm">Download all your links and data as JSON</p>
                </div>
                <button 
                  onClick={handleExportData}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                saved
                  ? 'bg-green-600 text-white'
                  : saving
                  ? 'bg-gray-600 text-white'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
              }`}
            >
              {saved ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
              ) : saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
