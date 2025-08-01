"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, ArrowRight, Sparkles, TrendingUp, Shield, Zap, Globe, Camera } from "lucide-react" // Убрал Phone
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation, detectUserLanguage } from "@/lib/i18n"
import { SMSService } from "@/lib/sms-service"

interface EnhancedAuthScreenProps {
  onLogin: (userData: any) => void
}

export function EnhancedAuthScreen({ onLogin }: EnhancedAuthScreenProps) {
  const [currentLanguage, setCurrentLanguage] = useState(detectUserLanguage())
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [step, setStep] = useState("welcome") // welcome, register, verify
  const [formData, setFormData] = useState({
    email: "", // Убрал phone
    name: "",
    profilePhoto: null as File | null,
    verificationCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [actualVerificationCode, setActualVerificationCode] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = useTranslation(currentLanguage)
  const smsService = SMSService.getInstance() // Название класса осталось SMSService, но он теперь только для email

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profilePhoto: file })
    }
  }

  const handleSendVerification = async () => {
    setIsLoading(true)
    const code = smsService.generateCode()
    setActualVerificationCode(code) // Сохраняем код для отображения в демо-режиме

    const success = await smsService.sendEmail(formData.email, code) // Всегда отправляем email

    if (success) {
      setVerificationSent(true)
      setStep("verify")
    } else {
      alert("Не удалось отправить код. Пожалуйста, попробуйте еще раз.")
    }
    setIsLoading(false)
  }

  const handleVerify = async () => {
    if (!smsService.validateCode(formData.verificationCode, actualVerificationCode)) {
      alert("Неверный код! Пожалуйста, проверьте код и попробуйте снова.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email: formData.email, // Убрал phone
        name: formData.name,
        profilePhoto: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : null,
        balance: 0,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        createdAt: new Date().toISOString(),
        isVerified: false,
        language: currentLanguage,
      }
      setIsLoading(false)
      onLogin(userData)
    }, 1500)
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Language Selector Button */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setShowLanguageSelector(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              {currentLanguage.toUpperCase()}
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <Image src="/abeba-logo.png" alt="ABEBA" width={200} height={200} className="mx-auto mb-6" />
            </div>
            <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">{t.welcome.title}</h1>
            <p className="text-2xl text-white/90 mb-2 font-bold">{t.welcome.subtitle}</p>
            <p className="text-lg text-white/80 mb-8">{t.welcome.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-sm text-white/80">{t.welcome.stats.fees}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">{t.welcome.stats.working}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-sm text-white/80">{t.welcome.stats.memes}</div>
              </div>
            </div>

            <Button
              onClick={() => setStep("register")}
              size="lg"
              className="bg-white text-orange-500 hover:bg-gray-100 font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {t.welcome.startButton}
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="font-bold mb-2">Instant transfers</h3>
                <p className="text-sm text-white/80">Faster than TikTok meme</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-300" />
                <h3 className="font-bold mb-2">Security</h3>
                <p className="text-sm text-white/80">Blockchain protected</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="font-bold mb-2">Growing token</h3>
                <p className="text-sm text-white/80">ABEBA on pump.fun</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                <h3 className="font-bold mb-2">Meme interface</h3>
                <p className="text-sm text-white/80">Banking with fun</p>
              </CardContent>
            </Card>
          </div>

          {/* Contract Info */}
          <div className="mt-8 text-center">
            <Badge className="bg-white/20 text-white text-sm px-4 py-2">
              Contract: 21CcDkerURgWdE7YfCLfhas7TdVXnpE22kjAAMEzpump
            </Badge>
          </div>
        </div>

        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          isOpen={showLanguageSelector}
          onClose={() => setShowLanguageSelector(false)}
        />
      </div>
    )
  }

  if (step === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Image src="/abeba-logo.png" alt="ABEBA" width={80} height={80} className="mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">{t.auth.register}</CardTitle>
            <CardDescription className="text-purple-300">{t.auth.fillData}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Photo */}
            <div className="text-center">
              <div
                className="w-20 h-20 mx-auto mb-2 bg-purple-900/20 border-2 border-dashed border-purple-500 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.profilePhoto ? (
                  <img
                    src={URL.createObjectURL(formData.profilePhoto) || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-purple-400" />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <Label className="text-purple-300 text-sm cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {t.auth.profilePhoto}
              </Label>
            </div>

            <div>
              <Label htmlFor="name" className="text-white flex items-center">
                <User className="w-4 h-4 mr-2" />
                {t.auth.name} *
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
                {t.auth.email} *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="abeba@memes.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                required // Email теперь обязателен
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">{t.auth.security}</h4>
                  <p className="text-xs text-blue-200">{t.auth.securityDesc}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSendVerification}
              disabled={!formData.name || !formData.email || isLoading} // Проверяем email
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? "Отправляем..." : t.auth.getCode}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep("welcome")}
              className="w-full border-purple-500/30 text-purple-300 bg-transparent"
            >
              {t.auth.back}
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
            <CardTitle className="text-white text-2xl">{t.auth.verification}</CardTitle>
            <CardDescription className="text-purple-300">
              {t.auth.enterCode} {formData.email}
            </CardDescription>
            {verificationSent && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 mt-2">
                <p className="text-green-300 text-sm">
                  Код отправлен! Проверьте ваш Email
                  <br />
                  <strong>Демо-код: {actualVerificationCode}</strong> {/* Отображаем демо-код */}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-white">
                {t.auth.confirmCode}
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
                  <h4 className="font-bold text-green-300 text-sm">{t.auth.almostReady}</h4>
                  <p className="text-xs text-green-200">{t.auth.almostReadyDesc}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={formData.verificationCode.length !== 4 || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isLoading ? "Создаем кошелек..." : t.auth.confirmAndLogin}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep("register")}
              className="w-full border-purple-500/30 text-purple-300 bg-transparent"
            >
              {t.auth.changeData}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-purple-400 text-sm" onClick={handleSendVerification}>
                {t.auth.noCode}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
