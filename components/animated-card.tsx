"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Copy, CreditCard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AnimatedCardProps {
  user: {
    balance: number
    abebaBalance: number
    cardNumber: string
    cardHolder: string
    cardExpiry: string
    cardCVV: string
    username: string
  }
}

export function AnimatedCard({ user }: AnimatedCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [showCardData, setShowCardData] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} скопирован!`)
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card Container */}
      <motion.div
        className="relative h-56 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front of Card */}
          <motion.div
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-10" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-5" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <span className="text-sm font-bold">A</span>
                  </motion.div>
                  <span className="text-lg font-bold">ABEBA</span>
                </div>
                <CreditCard className="w-6 h-6 opacity-80" />
              </div>

              {/* Balance Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm opacity-80">Баланс</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowBalance(!showBalance)
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <motion.div
                  animate={{ scale: showBalance ? 1 : 0.95 }}
                  className="text-2xl font-bold"
                >
                  {showBalance ? formatBalance(user.balance) : "••••••"}
                </motion.div>
                <div className="text-sm opacity-80">
                  + {showBalance ? user.abebaBalance.toFixed(2) : "••••"} ABEBA
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1">
                <div className="text-lg font-mono tracking-wider">
                  {showCardData ? formatCardNumber(user.cardNumber) : "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>{user.cardHolder}</span>
                  <span>{showCardData ? user.cardExpiry : "••/••"}</span>
                </div>
              </div>
            </div>

            {/* Chip */}
            <div className="absolute top-20 left-6 w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md opacity-80" />
          </motion.div>

          {/* Back of Card */}
          <motion.div
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-12 bg-black mt-6" />
            
            {/* CVV Section */}
            <div className="p-6 space-y-4">
              <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                <span className="text-black font-mono text-lg">
                  {showCardData ? user.cardCVV : "•••"}
                </span>
              </div>
              
              <div className="text-white text-xs opacity-60">
                Authorized signature - not valid unless signed
              </div>
              
              <div className="flex items-center justify-between text-white">
                <div className="text-sm">
                  <div className="opacity-60">Карта действительна до</div>
                  <div className="font-mono">{showCardData ? user.cardExpiry : "••/••"}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">ABEBA</div>
                  <div className="text-xs opacity-60">BANK</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Card Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 space-y-3"
      >
        {/* Toggle Card Data Visibility */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Показать данные карты</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCardData(!showCardData)}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            {showCardData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Copy Card Data */}
        {showCardData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(user.cardNumber, "Номер карты")}
              className="flex items-center space-x-2 text-xs"
            >
              <Copy className="w-3 h-3" />
              <span>Номер</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(user.cardCVV, "CVV")}
              className="flex items-center space-x-2 text-xs"
            >
              <Copy className="w-3 h-3" />
              <span>CVV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(user.cardExpiry, "Срок действия")}
              className="flex items-center space-x-2 text-xs"
            >
              <Copy className="w-3 h-3" />
              <span>Срок</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(user.cardHolder, "Имя держателя")}
              className="flex items-center space-x-2 text-xs"
            >
              <Copy className="w-3 h-3" />
              <span>Имя</span>
            </Button>
          </motion.div>
        )}

        {/* Card Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            💳 Нажмите на карту, чтобы перевернуть
          </p>
          <p className="text-xs text-gray-500 mt-1">
            🔄 Свайпните вверх/вниз для анимации
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          className="flex items-center space-x-2 py-3 border-green-200 text-green-600 hover:bg-green-50"
        >
          <Wallet className="w-4 h-4" />
          <span>Пополнить</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center space-x-2 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>Перевести</span>
        </Button>
      </motion.div>
    </div>
  )
}