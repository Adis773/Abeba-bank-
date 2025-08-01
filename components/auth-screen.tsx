"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, User, Mail, ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"
import Image from "next/image"

interface AuthScreenProps {
  onLogin: (userData: any) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState("welcome") // welcome, register, verify
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    verificationCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    setIsLoading(true)
    // Имитация отправки SMS
    setTimeout(() => {
      setIsLoading(false)
      setStep("verify")
    }, 2000)
  }

  const handleVerify = async () => {
    setIsLoading(true)
    // Имитация проверки кода
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        balance: 0,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        createdAt: new Date().toISOString(),
        isVerified: false,
      }
      setIsLoading(false)
      onLogin(userData)
    }, 1500)
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <Image src="/abeba-logo.png" alt="ABEBA" width={200} height={200} className="mx-auto mb-6" />
            </div>
            <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">ABEBA БАНК</h1>
            <p className="text-2xl text-white/90 mb-2 font-bold">Мемно. Абебно. Жизненно. 🦆</p>
            <p className="text-lg text-white/80 mb-8">Первый в мире мемный банк с нулевыми комиссиями!</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-sm text-white/80">Комиссии</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">Работаем</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-sm text-white/80">Мемов</div>
              </div>
            </div>

            <Button
              onClick={() => setStep("register")}
              size="lg"
              className="bg-white text-orange-500 hover:bg-gray-100 font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Начать абебить! 🚀
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="font-bold mb-2">Мгновенные переводы</h3>
                <p className="text-sm text-white/80">Быстрее чем мем в TikTok</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-300" />
                <h3 className="font-bold mb-2">Безопасность</h3>
                <p className="text-sm text-white/80">Защищено блокчейном</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="font-bold mb-2">Растущий токен</h3>
                <p className="text-sm text-white/80">ABEBA на pump.fun</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                <h3 className="font-bold mb-2">Мемный интерфейс</h3>
                <p className="text-sm text-white/80">Банкинг с приколом</p>
              </CardContent>
            </Card>
          </div>

          {/* Contract Info */}
          <div className="mt-8 text-center">
            <Badge className="bg-white/20 text-white text-sm px-4 py-2">
              Контракт: 21CcDkerURgWdE7YfCLfhas7TdVXnpE22kjAAMEzpump
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  if (step === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Image src="/abeba-logo.png" alt="ABEBA" width={80} height={80} className="mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">Регистрация в ABEBA</CardTitle>
            <CardDescription className="text-purple-300">
              Заполни данные и получи свой мемный кошелек! 🦆
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-white flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Номер телефона *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                required
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-white flex items-center">
                <User className="w-4 h-4 mr-2" />
                Имя *
              </Label>
              <Input
                id="name"
                placeholder="Абеба Мемович"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email (опционально)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="abeba@memes.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">Безопасность</h4>
                  <p className="text-xs text-blue-200">
                    Мы отправим SMS-код для подтверждения. Твои данные защищены! 🔒
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={!formData.phone || !formData.name || isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? "Отправляем SMS..." : "Получить код 📱"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep("welcome")}
              className="w-full border-purple-500/30 text-purple-300 bg-transparent"
            >
              Назад
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Image src="/abeba-logo.png" alt="ABEBA" width={80} height={80} className="mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">Подтверждение</CardTitle>
            <CardDescription className="text-purple-300">Введи код из SMS на номер {formData.phone}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-white">
                Код подтверждения
              </Label>
              <Input
                id="code"
                placeholder="1234"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300 text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-green-300 text-sm">Почти готово!</h4>
                  <p className="text-xs text-green-200">
                    После подтверждения ты получишь свой ABEBA кошелек и сможешь начать абебить! 🦆
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={formData.verificationCode.length !== 4 || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isLoading ? "Создаем кошелек..." : "Подтвердить и войти 🚀"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep("register")}
              className="w-full border-purple-500/30 text-purple-300 bg-transparent"
            >
              Изменить данные
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-purple-400 text-sm">
                Не пришел код? Отправить еще раз
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
