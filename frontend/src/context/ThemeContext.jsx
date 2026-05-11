import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(undefined)

const applyTheme = (themeValue) => {
  const root = document.documentElement
  if (themeValue === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('falsfa_theme')
    if (savedTheme) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setThemeState(initialTheme)
      applyTheme(initialTheme)
    }
    setMounted(true)
  }, [])

  const setTheme = useCallback((themeValue) => {
    setThemeState(themeValue)
    localStorage.setItem('falsfa_theme', themeValue)
    applyTheme(themeValue)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('falsfa_theme', newTheme)
      applyTheme(newTheme)
      return newTheme
    })
  }, [])

  // Prevent rendering until hydrated to avoid hydration mismatch
  if (!mounted) {
    return children
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
