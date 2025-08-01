"use client"

import { useState, useEffect } from "react"
import { EnhancedAuthScreen } from "@/components/enhanced-auth-screen"
import { MainApp } from "@/components/main-app"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Проверяем есть ли сохраненная сессия
    const savedUser = localStorage.getItem("abeba_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
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

  if (!isAuthenticated) {
    return <EnhancedAuthScreen onLogin={handleLogin} />
  }

  return <MainApp user={user} onLogout={handleLogout} />
}
