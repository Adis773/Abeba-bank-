"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Plus, Clock, Percent, DollarSign, Users, Copy, Edit, Trash2, Zap, Target, Share2 } from "lucide-react"

export function CouponsManager() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [couponData, setCouponData] = useState({
    name: "",
    type: "percent",
    value: "",
    description: "",
    minAmount: "",
    maxUses: "",
    expiryDate: "",
    isActive: true,
  })

  const existingCoupons = [
    {
      id: 1,
      name: "ABEBA20",
      type: "percent",
      value: 20,
      description: "Скидка 20% на всё!",
      used: 45,
      maxUses: 100,
      expires: "2024-12-31",
      isActive: true,
      revenue: "2,340.50",
    },
    {
      id: 2,
      name: "NEWBIE",
      type: "fixed",
      value: 50,
      description: "50 ABEBA новым клиентам",
      used: 23,
      maxUses: 50,
      expires: "2024-11-30",
      isActive: true,
      revenue: "1,150.00",
    },
    {
      id: 3,
      name: "FLASH30",
      type: "percent",
      value: 30,
      description: "Flash Sale - 30% скидка!",
      used: 89,
      maxUses: 100,
      expires: "2024-10-25",
      isActive: false,
      revenue: "4,567.80",
    },
  ]

  const promoTemplates = [
    { name: "Happy Hour", discount: "25%", time: "17:00-19:00", icon: "🍻" },
    { name: "Flash Sale", discount: "30%", time: "1 час", icon: "⚡" },
    { name: "Weekend Special", discount: "15%", time: "Выходные", icon: "🎉" },
    { name: "First Order", discount: "50 ABEBA", time: "Для новых", icon: "🎁" },
  ]

  const handleCreateCoupon = () => {
    // Logic to create coupon
    setShowCreateForm(false)
    setCouponData({
      name: "",
      type: "percent",
      value: "",
      description: "",
      minAmount: "",
      maxUses: "",
      expiryDate: "",
      isActive: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Купоны и акции</h2>
          <p className="text-purple-300">Создавай мемные промокоды и привлекай клиентов! 🎯</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
          <Plus className="w-4 h-4 mr-2" />
          Создать купон
        </Button>
      </div>

      {/* Quick Templates */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Быстрые шаблоны
          </CardTitle>
          <CardDescription className="text-purple-300">Популярные типы акций для быстрого запуска</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {promoTemplates.map((template, i) => (
              <Card
                key={i}
                className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30 cursor-pointer transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <h4 className="font-bold text-white mb-1">{template.name}</h4>
                  <p className="text-purple-300 text-sm mb-2">{template.time}</p>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">{template.discount}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Coupon Form */}
      {showCreateForm && (
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Создать новый купон</CardTitle>
            <CardDescription className="text-purple-300">Заполните данные для создания промокода</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="couponName" className="text-white">
                  Название купона
                </Label>
                <Input
                  id="couponName"
                  placeholder="ABEBA50"
                  value={couponData.name}
                  onChange={(e) => setCouponData({ ...couponData, name: e.target.value.toUpperCase() })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label className="text-white">Тип скидки</Label>
                <Select
                  value={couponData.type}
                  onValueChange={(value) => setCouponData({ ...couponData, type: value })}
                >
                  <SelectTrigger className="bg-purple-900/20 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Процентная скидка (%)</SelectItem>
                    <SelectItem value="fixed">Фиксированная сумма (ABEBA)</SelectItem>
                    <SelectItem value="cashback">Кэшбэк (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="couponValue" className="text-white">
                  Размер скидки {couponData.type === "percent" || couponData.type === "cashback" ? "(%)" : "(ABEBA)"}
                </Label>
                <Input
                  id="couponValue"
                  type="number"
                  placeholder={couponData.type === "fixed" ? "50" : "20"}
                  value={couponData.value}
                  onChange={(e) => setCouponData({ ...couponData, value: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label htmlFor="maxUses" className="text-white">
                  Максимум использований
                </Label>
                <Input
                  id="maxUses"
                  type="number"
                  placeholder="100"
                  value={couponData.maxUses}
                  onChange={(e) => setCouponData({ ...couponData, maxUses: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label htmlFor="minAmount" className="text-white">
                  Минимальная сумма заказа
                </Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="100"
                  value={couponData.minAmount}
                  onChange={(e) => setCouponData({ ...couponData, minAmount: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate" className="text-white">
                  Дата окончания
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={couponData.expiryDate}
                  onChange={(e) => setCouponData({ ...couponData, expiryDate: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                Описание
              </Label>
              <Textarea
                id="description"
                placeholder="Скидка 20% на все товары! Только до конца месяца 🔥"
                value={couponData.description}
                onChange={(e) => setCouponData({ ...couponData, description: e.target.value })}
                className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={couponData.isActive}
                onCheckedChange={(checked) => setCouponData({ ...couponData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-white">
                Активировать сразу
              </Label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateCoupon} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Gift className="w-4 h-4 mr-2" />
                Создать купон
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-purple-500/30">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Coupons */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Gift className="w-5 h-5 mr-2 text-purple-400" />
            Активные купоны
          </CardTitle>
          <CardDescription className="text-purple-300">Управляй своими промокодами и акциями</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingCoupons.map((coupon) => (
              <Card key={coupon.id} className="bg-purple-900/20 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        {coupon.type === "percent" ? (
                          <Percent className="w-6 h-6 text-white" />
                        ) : coupon.type === "fixed" ? (
                          <DollarSign className="w-6 h-6 text-white" />
                        ) : (
                          <Target className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-lg">{coupon.name}</h4>
                          <Badge
                            className={
                              coupon.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }
                          >
                            {coupon.isActive ? "Активен" : "Неактивен"}
                          </Badge>
                        </div>
                        <p className="text-purple-300 text-sm">{coupon.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-purple-200">
                            <Users className="w-4 h-4 inline mr-1" />
                            {coupon.used}/{coupon.maxUses} использований
                          </span>
                          <span className="text-purple-200">
                            <Clock className="w-4 h-4 inline mr-1" />
                            До {coupon.expires}
                          </span>
                          <span className="text-green-400">
                            <DollarSign className="w-4 h-4 inline mr-1" />+{coupon.revenue} ABEBA
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-white">
                          {coupon.type === "fixed" ? `${coupon.value}` : `${coupon.value}%`}
                        </div>
                        <div className="text-sm text-purple-300">{coupon.type === "fixed" ? "ABEBA" : "скидка"}</div>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar for usage */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-purple-300 mb-1">
                      <span>Использовано</span>
                      <span>{Math.round((coupon.used / coupon.maxUses) * 100)}%</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${(coupon.used / coupon.maxUses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral System */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-green-400" />
            Реферальная система
          </CardTitle>
          <CardDescription className="text-purple-300">
            Автоматические промо-ссылки для привлечения друзей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-3">Твоя реферальная ссылка</h4>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mb-3">
                <code className="text-purple-200 text-sm break-all">https://abeba.bank/ref/adisshop?bonus=50</code>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
                <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Статистика рефералов</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-300">Переходов по ссылке:</span>
                  <span className="text-white font-bold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Регистраций:</span>
                  <span className="text-white font-bold">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Твой доход:</span>
                  <span className="text-green-400 font-bold">+210.00 ABEBA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Конверсия:</span>
                  <span className="text-blue-400 font-bold">17.0%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-300 mb-1">Бонусная программа</h4>
                <p className="text-sm text-green-200">
                  За каждого приведённого друга ты получаешь 5% от его первой покупки! А он получает скидку 50 ABEBA на
                  первый заказ. Всем выгодно! 🤝
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
