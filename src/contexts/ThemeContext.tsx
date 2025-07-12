'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return default values if not within provider (for server-side rendering)
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      toggleTheme: () => {}
    }
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage and user settings
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First try to get from user settings
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.settings?.theme) {
            setThemeState(data.settings.theme)
            localStorage.setItem('linkVaultTheme', data.settings.theme)
            applyTheme(data.settings.theme)
            setMounted(true)
            return
          }
        }
      } catch (error) {
        console.log('Could not load theme from server, using localStorage fallback')
      }

      // Fallback to localStorage
      const savedTheme = localStorage.getItem('linkVaultTheme') as Theme
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setThemeState(savedTheme)
        applyTheme(savedTheme)
      } else {
        // Default to dark theme
        setThemeState('dark')
        applyTheme('dark')
      }
      setMounted(true)
    }

    loadTheme()
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(newTheme)
    
    // Also set data attribute for additional styling
    root.setAttribute('data-theme', newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('linkVaultTheme', newTheme)
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
