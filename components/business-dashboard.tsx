"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Store, Plus, QrCode, TrendingUp, Users, DollarSign, Settings, Upload, CheckCircle, Eye, Camera } from 'lucide-react'
import Image from "next/image"
import { RealQRGenerator } from "@/components/real-qr-generator"
import { registerBusiness, getBusinessByUserId } from "@/app/actions/business" // Импортируем серверные действия

interface BusinessDashboardProps {
  user: any
}

export function BusinessDashboard({ user }: BusinessDashboardProps) {
  const [hasBusinessAccount, setHasBusinessAccount] = useState(false)
  const [businessData, setBusinessData] = useState({
    id: "", // Добавляем ID бизнеса
    name: "",
    description: "",
    category: "",
    email: user.email || "",
    ownerId: user.id, // Связываем бизнес с пользователем
    businessPhoto: null as File | null, // Для загрузки фото
    businessPhotoUrl: "/placeholder.svg?height=100&width=100", // URL для отображения
  })
  const [registrationStep, setRegistrationStep] = useState(1)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showQRGeneratorModal, setShowQRGeneratorModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загрузка данных о бизнесе при монтировании компонента
  useEffect(() => {
    const fetchBusiness = async () => {
      const existingBusiness = await getBusinessByUserId(user.id)
      if (existingBusiness) {
        setHasBusinessAccount(true)
        setBusinessData({
          ...businessData,
          id: existingBusiness.id,
          name: existingBusiness.name,
          description: existingBusiness.description,
          category: existingBusiness.category,
          email: existingBusiness.email,
          businessPhotoUrl: existingBusiness.businessPhotoUrl || "/placeholder.svg?height=100&width=100",
        })
      }
    }
    fetchBusiness()
  }, [user.id])

  const businessStats = {
    todayRevenue: 1247.5,
    totalCustomers: 156,
    averageCheck: 87.3,
    transactionsToday: 23,
  }

  const recentTransactions = [
    { id: 1, customer: "@foodlover", amount: 125.0, item: "Шаурма + кола", time: "5 мин назад" },
    { id: 2, customer: "@student", amount: 45.5, item: "Кофе латте", time: "12 мин назад" },
    { id: 3, customer: "@memebro", amount: 200.0, item: "Комбо обед", time: "25 мин назад" },
  ]

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBusinessData({ ...businessData, businessPhoto: file, businessPhotoUrl: URL.createObjectURL(file) })
    }
  }

  const handleBusinessRegistration = async () => {
    setIsRegistering(true)
    try {
      // В реальном приложении здесь была бы загрузка фото в хранилище (например, Vercel Blob или Supabase Storage)
      // и получение URL, который затем сохраняется в базе данных.
      // Пока просто используем заглушку для URL фото.
      const photoUrl = businessData.businessPhoto
        ? URL.createObjectURL(businessData.businessPhoto)
        : "/placeholder.svg?height=100&width=100"

      const newBusiness = await registerBusiness({
        name: businessData.name,
        description: businessData.description,
        category: businessData.category,
        email: businessData.email,
        ownerId: user.id,
        businessPhotoUrl: photoUrl, // Передаем URL фото
      })

      if (newBusiness) {
        setHasBusinessAccount(true)
        setBusinessData({
          ...businessData,
          id: newBusiness.id,
          businessPhotoUrl: newBusiness.businessPhotoUrl,
        })
        alert("Бизнес успешно зарегистрирован!")
      } else {
        alert("Ошибка регистрации бизнеса.")
      }
    } catch (error) {
      console.error("Ошибка при регистрации бизнеса:", error)
      alert("Произошла ошибка при регистрации бизнеса.")
    } finally {
      setIsRegistering(false)
    }
  }

  if (!hasBusinessAccount) {
    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50">
          <CardContent className="p-8 text-center">
            <Image src="/abeba-logo.png" alt="ABEBA" width={80} height={80} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Открой свой бизнес в ABEBA! 🦆</h2>
            <p className="text-purple-200 mb-6">
              Регистрируйся за 5 минут, принимай оплаты без комиссий и зарабатывай больше!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-sm text-purple-200">Комиссия</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">5 мин</div>
                <div className="text-sm text-purple-200">Регистрация</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-purple-200">Поддержка</div>
              </div>
            </div>

            <Button
              onClick={() => setRegistrationStep(1)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-8 py-3 whitespace-nowrap"
            >
              <Store className="w-5 h-5 mr-2" />
              Открыть бизнес-аккаунт 🚀
            </Button>
          </CardContent>
        </Card>

        {/* Registration Form */}
        {registrationStep > 0 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Регистрация бизнеса</CardTitle>
              <CardDescription className="text-purple-300">
                Шаг {registrationStep} из 3 - Заполни основную информацию
              </CardDescription>
              <Progress value={(registrationStep / 3) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {registrationStep === 1 && (
                <>
                  {/* Business Photo */}
                  <div className="text-center">
                    <div
                      className="w-20 h-20 mx-auto mb-2 bg-purple-900/20 border-2 border-dashed border-purple-500 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {businessData.businessPhotoUrl &&
                      businessData.businessPhotoUrl !== "/placeholder.svg?height=100&width=100" ? (
                        <img
                          src={businessData.businessPhotoUrl || "/placeholder.svg"}
                          alt="Business Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-purple-400" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Label
                      className="text-purple-300 text-sm cursor-pointer whitespace-nowrap"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Загрузить логотип бизнеса (опционально)
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="businessName" className="text-white">
                      Название бизнеса *
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Мемная Шаурма 🥙"
                      value={businessData.name}
                      onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                      className="bg-purple-900/20 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessDesc" className="text-white">
                      Описание
                    </Label>
                    <Textarea
                      id="businessDesc"
                      placeholder="Самая абебная шаурма в городе! 🔥"
                      value={businessData.description}
                      onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                      className="bg-purple-900/20 border-purple-500/30 text-white"
                    />
                  </div>

                  <Button
                    onClick={() => setRegistrationStep(2)}
                    disabled={!businessData.name}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 whitespace-nowrap"
                  >
                    Далее →
                  </Button>
                </>
              )}

              {registrationStep === 2 && (
                <>
                  <div className="text-center py-6">
                    <Upload className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Документы (опционально)</h3>
                    <p className="text-purple-300 mb-4">Загрузи документы для получения статуса "Проверен" ✅</p>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <div className="text-sm text-blue-200">
                        <strong>Преимущества верификации:</strong>
                        <br />• Покупатели видят бейдж "Проверен"
                        <br />• Больше доверия = больше продаж
                        <br />• Приоритетная поддержка
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 bg-transparent whitespace-nowrap"
                      >
                        📄 Загрузить паспорт
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 bg-transparent whitespace-nowrap"
                      >
                        🏢 Документы ИП/ООО
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setRegistrationStep(1)}
                      className="flex-1 border-purple-500/30 bg-transparent whitespace-nowrap"
                    >
                      ← Назад
                    </Button>
                    <Button
                      onClick={() => setRegistrationStep(3)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 whitespace-nowrap"
                    >
                      Пропустить / Далее →
                    </Button>
                  </div>
                </>
              )}

              {registrationStep === 3 && (
                <>
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Почти готово! 🎉</h3>
                    <p className="text-purple-300 mb-6">Проверь данные и запускай свой абебный бизнес!</p>

                    <Card className="bg-purple-900/20 border-purple-500/20 text-left">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-purple-300">Название:</span>
                          <span className="text-white">{businessData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-300">Владелец:</span>
                          <span className="text-white">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-300">Email:</span>
                          <span className="text-white">{businessData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-300">Комиссия:</span>
                          <span className="text-green-400 font-bold">0% 🔥</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Button
                    onClick={handleBusinessRegistration}
                    disabled={isRegistering}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg py-3 whitespace-nowrap"
                  >
                    {isRegistering ? "Создаем бизнес-аккаунт..." : "🚀 Запустить бизнес!"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Business Dashboard
  return (
    <div className="space-y-6">
      {/* Business Header */}
      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center overflow-hidden">
                {businessData.businessPhotoUrl &&
                businessData.businessPhotoUrl !== "/placeholder.svg?height=100&width=100" ? (
                  <img
                    src={businessData.businessPhotoUrl || "/placeholder.svg"}
                    alt="Business Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{businessData.name || "Мой Бизнес"}</h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400 whitespace-nowrap">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Активен
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-blue-500/20 text-blue-400 whitespace-nowrap">✅ Проверен</Badge>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" className="border-green-500/30 text-green-300 bg-transparent whitespace-nowrap">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">{businessStats.todayRevenue.toFixed(2)}</div>
            <div className="text-sm text-green-300">ABEBA сегодня</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">{businessStats.totalCustomers}</div>
            <div className="text-sm text-blue-300">Клиентов</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{businessStats.averageCheck.toFixed(2)}</div>
            <div className="text-sm text-purple-300">Средний чек</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <QrCode className="w-8 h-8 mx-auto text-orange-400 mb-2" />
            <div className="text-2xl font-bold text-white">{businessStats.transactionsToday}</div>
            <div className="text-sm text-orange-300">Операций сегодня</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button
          onClick={() => setShowQRGeneratorModal(true)}
          className="h-20 bg-gradient-to-br from-blue-500 to-cyan-600 flex-col space-y-2"
        >
          <QrCode className="w-6 h-6" />
          <span className="whitespace-nowrap">Создать QR</span>
        </Button>

        <Button className="h-20 bg-gradient-to-br from-purple-500 to-pink-600 flex-col space-y-2">
          <Plus className="w-6 h-6" />
          <span className="whitespace-nowrap">Добавить товар</span>
        </Button>

        <Button className="h-20 bg-gradient-to-br from-green-500 to-emerald-600 flex-col space-y-2">
          <Eye className="w-6 h-6" />
          <span className="whitespace-nowrap">Отчеты</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Последние продажи</CardTitle>
          <CardDescription className="text-purple-300">Твоя абебная выручка 🦆</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-500/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{tx.item}</div>
                    <div className="text-sm text-purple-300">От {tx.customer}</div>
                    <div className="text-xs text-purple-400">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">+{tx.amount.toFixed(2)} ABEBA</div>
                  <Badge className="text-xs bg-green-500/20 text-green-400">Завершено</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Generator Modal */}
      <RealQRGenerator isOpen={showQRGeneratorModal} onClose={() => setShowQRGeneratorModal(false)} />
    </div>
  )
}
