"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Sparkles, Shield, Zap, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onComplete: () => void
}

const slides = [
  {
    id: 1,
    title: "ABEBA BANK",
    subtitle: "Банк будущего уже здесь! 🚀",
    description: "Добро пожаловать в новую эру финансов",
    icon: <Sparkles className="w-16 h-16 text-yellow-400" />,
    gradient: "from-purple-600 via-pink-500 to-orange-400"
  },
  {
    id: 2,
    title: "НУЛЕВЫЕ КОМИССИИ",
    subtitle: "Забудь про скрытые платежи! 💰",
    description: "Все переводы и операции абсолютно бесплатно",
    icon: <Gift className="w-16 h-16 text-green-400" />,
    gradient: "from-green-500 via-emerald-500 to-teal-400"
  },
  {
    id: 3,
    title: "ОГРОМНЫЕ БОНУСЫ",
    subtitle: "Получай деньги за каждую покупку! 🎁",
    description: "+5% ABEBA от каждой транзакции",
    icon: <Zap className="w-16 h-16 text-blue-400" />,
    gradient: "from-blue-500 via-cyan-500 to-indigo-400"
  },
  {
    id: 4,
    title: "ШВЕЙЦАРСКАЯ ЗАЩИТА",
    subtitle: "Твои данные под максимальной защитой! 🛡️",
    description: "Банковская тайна на уровне Швейцарии",
    icon: <Shield className="w-16 h-16 text-red-400" />,
    gradient: "from-red-500 via-rose-500 to-pink-400"
  },
  {
    id: 5,
    title: "НАЧНИ СЕЙЧАС",
    subtitle: "Создай свой бизнес за 5 минут! ⚡",
    description: "Будь покупателем или продавцом - выбор за тобой",
    icon: <Sparkles className="w-16 h-16 text-purple-400" />,
    gradient: "from-purple-500 via-violet-500 to-indigo-400"
  }
]

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header with Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center pt-8 pb-4"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white font-bold text-xl">A</span>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ABEBA
          </h1>
        </div>
      </motion.div>

      {/* Main Slide Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-center max-w-md"
          >
            {/* Background Gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-10 rounded-3xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 flex justify-center"
            >
              {slides[currentSlide].icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-bold text-gray-800 mb-3"
            >
              {slides[currentSlide].title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl font-semibold text-gray-700 mb-4"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Floating Emojis */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-4xl"
        >
          💰
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-10 text-4xl"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 text-4xl"
        >
          ⚡
        </motion.div>
        <motion.div
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 text-4xl"
        >
          🎁
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-2 mb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-purple-500 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center px-6 pb-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="text-gray-600 hover:text-purple-600"
        >
          Назад
        </Button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Начать! 🚀
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Далее
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="absolute top-6 right-6 text-gray-500 hover:text-purple-600 transition-colors"
      >
        Пропустить
      </motion.button>
    </div>
  )
}