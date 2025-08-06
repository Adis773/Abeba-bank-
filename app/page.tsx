"use client"

import { useState, useEffect } from "react"
import { NewAuthScreen } from "@/components/new-auth-screen"
import { NewMainApp } from "@/components/new-main-app"
import { WelcomeScreen } from "@/components/welcome-screen"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Проверяем есть ли сохраненная сессия
    const savedUser = localStorage.getItem("abeba_user")
    const welcomeShown = localStorage.getItem("abeba_welcome_shown")
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    
    if (welcomeShown) {
      setShowWelcome(false)
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("abeba_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("abeba_user")
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    localStorage.setItem("abeba_welcome_shown", "true")
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (!isAuthenticated) {
    return <NewAuthScreen onLogin={handleLogin} />
  }

  return <NewMainApp user={user} onLogout={handleLogout} />
}
