"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, QrCode, Send, ArrowDownToLine, Store, TrendingUp, Settings, 
  LogOut, Copy, Eye, EyeOff, Plus, Wifi, CreditCard, Gift, Shield,
  Bell, User, Home, BarChart3, Zap, DollarSign, Smartphone
} from 'lucide-react'
import { AnimatedCard } from "@/components/animated-card"
import { RealBuyAbebaModal } from "@/components/real-buy-abeba-modal"
import { SendMoneyModal } from "@/components/send-money-modal"
import { ReceiveMoneyModal } from "@/components/receive-money-modal"
import { RealQRScanner } from "@/components/real-qr-scanner"
import { RealNFCPayment } from "@/components/real-nfc-payment"
import { BusinessDashboard } from "@/components/business-dashboard"
import { Analytics } from "@/components/analytics"
import { Toaster } from "sonner"
import { toast } from "sonner"

interface NewMainAppProps {
  user: any
  onLogout: () => void
}

export function NewMainApp({ user, onLogout }: NewMainAppProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showNFCModal, setShowNFCModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Бонус зачислен!", message: "+5 ABEBA за покупку", time: "2 мин назад", type: "bonus" },
    { id: 2, title: "Новый перевод", message: "Получен перевод 100$", time: "5 мин назад", type: "transfer" }
  ])

  const [recentTransactions] = useState([
    { id: 1, type: "income", amount: 250, description: "Перевод от John Doe", time: "10:30", status: "completed" },
    { id: 2, type: "outcome", amount: 75, description: "Покупка в магазине", time: "09:15", status: "completed" },
    { id: 3, type: "bonus", amount: 12.5, description: "Бонус ABEBA 5%", time: "09:15", status: "completed" },
    { id: 4, type: "income", amount: 500, description: "Зарплата", time: "Вчера", status: "completed" }
  ])

  const quickActions = [
    { id: "send", icon: Send, label: "Отправить", color: "blue", action: () => setShowSendModal(true) },
    { id: "receive", icon: ArrowDownToLine, label: "Получить", color: "green", action: () => setShowReceiveModal(true) },
    { id: "qr", icon: QrCode, label: "QR-код", color: "purple", action: () => setShowQRScanner(true) },
    { id: "nfc", icon: Wifi, label: "NFC", color: "orange", action: () => setShowNFCModal(true) },
    { id: "buy", icon: Plus, label: "Купить ABEBA", color: "pink", action: () => setShowBuyModal(true) },
    { id: "business", icon: Store, label: "Бизнес", color: "indigo", action: () => setActiveTab("business") }
  ]

  const stats = [
    { label: "Общий баланс", value: `$${user.balance.toFixed(2)}`, change: "+12.5%", color: "green" },
    { label: "ABEBA токены", value: user.abebaBalance.toFixed(2), change: "+5.2%", color: "purple" },
    { label: "Транзакций", value: "47", change: "+23", color: "blue" },
    { label: "Бонусов получено", value: "$125.50", change: "+$15.20", color: "orange" }
  ]

  // Симуляция уведомлений
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const bonusAmount = (Math.random() * 10 + 1).toFixed(2)
        toast.success(`🎉 Получен бонус +${bonusAmount} ABEBA!`, {
          description: "За активность в приложении"
        })
      }
    }, 30000) // Каждые 30 секунд

    return () => clearInterval(interval)
  }, [])

  const formatTransactionAmount = (amount: number, type: string) => {
    const sign = type === "income" || type === "bonus" ? "+" : "-"
    const color = type === "income" || type === "bonus" ? "text-green-600" : "text-red-600"
    return (
      <span className={color}>
        {sign}${amount.toFixed(2)}
      </span>
    )
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income": return <ArrowDownToLine className="w-4 h-4 text-green-600" />
      case "outcome": return <Send className="w-4 h-4 text-red-600" />
      case "bonus": return <Gift className="w-4 h-4 text-purple-600" />
      default: return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">A</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ABEBA BANK
              </h1>
              <p className="text-sm text-gray-600">Привет, {user.username}! 👋</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="mt-0">
            <div className="p-4 space-y-6">
              {/* Animated Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AnimatedCard user={user} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-gray-800">Быстрые действия</h2>
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className={`p-4 rounded-2xl bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 border border-${action.color}-200 hover:shadow-lg transition-all`}
                    >
                      <action.icon className={`w-6 h-6 text-${action.color}-600 mx-auto mb-2`} />
                      <span className={`text-sm font-medium text-${action.color}-700`}>
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-semibold text-gray-800">Статистика</h2>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                          <p className={`text-sm text-${stat.color}-600`}>{stat.change}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Последние операции</h2>
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    Все
                  </Button>
                </div>
                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border-0 shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {formatTransactionAmount(transaction.amount, transaction.type)}
                        <div className="flex items-center justify-end mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.status === "completed" ? "✓" : "⏳"}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Promotional Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2">🎉 Огромные бонусы!</h3>
                        <p className="text-sm opacity-90">
                          Получайте до 5% ABEBA с каждой покупки
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Узнать больше
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-0">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Кошелёк</h2>
              {/* Wallet content */}
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <BusinessDashboard user={user} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <Analytics />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Профиль</h2>
              {/* Profile content */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100"
      >
        <div className="flex items-center justify-around py-2">
          {[
            { id: "home", icon: Home, label: "Главная" },
            { id: "wallet", icon: Wallet, label: "Кошелёк" },
            { id: "business", icon: Store, label: "Бизнес" },
            { id: "analytics", icon: BarChart3, label: "Аналитика" },
            { id: "profile", icon: User, label: "Профиль" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Modals */}
      <RealBuyAbebaModal 
        isOpen={showBuyModal} 
        onClose={() => setShowBuyModal(false)} 
      />
      <SendMoneyModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        user={user} 
      />
      <ReceiveMoneyModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
        user={user} 
      />
      <RealQRScanner 
        isOpen={showQRScanner} 
        onClose={() => setShowQRScanner(false)} 
      />
      <RealNFCPayment 
        isOpen={showNFCModal} 
        onClose={() => setShowNFCModal(false)} 
        user={user} 
      />
    </div>
  )
}