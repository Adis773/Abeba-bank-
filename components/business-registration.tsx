"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Store, Upload, CheckCircle, Clock, Zap, Rocket, Building, User } from "lucide-react"

export function BusinessRegistration() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    category: "",
    ownerName: "",
    phone: "",
    email: "",
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const businessTypes = [
    { value: "ip", label: "ИП (Индивидуальный предприниматель)" },
    { value: "ooo", label: "ООО (Общество с ограниченной ответственностью)" },
    { value: "micro", label: "Микро-бизнес (без регистрации)" },
  ]

  const categories = [
    "🍕 Еда и напитки",
    "👕 Одежда и аксессуары",
    "💻 IT и технологии",
    "🎨 Творчество и хобби",
    "🏠 Дом и быт",
    "🚗 Авто и транспорт",
    "💄 Красота и здоровье",
    "📚 Образование",
    "🎮 Развлечения",
    "🔧 Услуги",
  ]

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-white">
                Название бизнеса
              </Label>
              <Input
                id="businessName"
                placeholder="Мемная Шаурма 🥙"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label className="text-white">Тип бизнеса</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger className="bg-purple-900/20 border-purple-500/30 text-white">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Категория</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-purple-900/20 border-purple-500/30 text-white">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                Описание бизнеса
              </Label>
              <Textarea
                id="description"
                placeholder="Самая абебная шаурма в городе! Готовим с любовью и мемами 🔥"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ownerName" className="text-white">
                ФИО владельца
              </Label>
              <Input
                id="ownerName"
                placeholder="Иванов Иван Иванович"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">
                Телефон
              </Label>
              <Input
                id="phone"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@abeba.bank"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Загрузка документов</h3>
              <p className="text-purple-300">Загрузите необходимые документы для верификации</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-purple-900/20 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Паспорт (главная страница)</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-purple-500/30 bg-transparent">
                      Загрузить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Документы ИП/ООО</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-purple-500/30 bg-transparent">
                      Загрузить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300">Быстрая верификация</h4>
                  <p className="text-sm text-blue-200">
                    Мы используем AI для мгновенной проверки документов. Обычно это занимает менее 2 минут! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Поздравляем!</h3>
              <p className="text-purple-300">Ваш бизнес успешно зарегистрирован в ABEBA Банк</p>
            </div>

            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50">
              <CardContent className="p-6">
                <h4 className="font-bold text-white mb-4">Ваши данные:</h4>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Бизнес ID:</span>
                    <span className="text-white font-mono">
                      @{formData.businessName.toLowerCase().replace(/\s+/g, "")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Статус:</span>
                    <Badge className="bg-green-500">Активен</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Комиссия:</span>
                    <span className="text-green-400 font-bold">0% 🔥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Store className="w-4 h-4 mr-2" />
                Открыть кабинет
              </Button>
              <Button variant="outline" className="border-purple-500/30 bg-transparent">
                <Rocket className="w-4 h-4 mr-2" />
                Создать QR
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Store className="w-6 h-6 mr-2 text-purple-400" />
            Регистрация бизнеса за 5 минут
          </CardTitle>
          <CardDescription className="text-purple-300">
            Шаг {step} из {totalSteps} -{" "}
            {step === 1
              ? "Основная информация"
              : step === 2
                ? "Контактные данные"
                : step === 3
                  ? "Документы"
                  : "Готово!"}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {step < totalSteps && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="border-purple-500/30 bg-transparent"
              >
                Назад
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={step === 1 && (!formData.businessName || !formData.businessType)}
              >
                {step === 3 ? "Завершить" : "Далее"}
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <h4 className="font-bold text-white">Мгновенно</h4>
            <p className="text-sm text-green-300">Регистрация за 5 минут</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">0%</div>
            <h4 className="font-bold text-white">Без комиссий</h4>
            <p className="text-sm text-blue-300">Навсегда</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-purple-400 mb-2" />
            <h4 className="font-bold text-white">24/7</h4>
            <p className="text-sm text-purple-300">Работает всегда</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
