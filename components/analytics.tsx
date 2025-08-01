"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, ShoppingCart, DollarSign, Download, Calendar, Target, Zap, Trophy, Star, BarChart, PieChart, LineChart } from 'lucide-react'

export function Analytics() {
  const stats = [
    { title: "Общий оборот", value: "12,847.69 ABEBA", change: "+23.5%", icon: DollarSign, color: "text-green-400" },
    { title: "Транзакции", value: "1,337", change: "+15.2%", icon: ShoppingCart, color: "text-blue-400" },
    { title: "Клиенты", value: "420", change: "+8.7%", icon: Users, color: "text-purple-400" },
    { title: "Средний чек", value: "96.15 ABEBA", change: "+5.1%", icon: Target, color: "text-orange-400" },
  ]

  const topProducts = [
    { name: "Шаурма Классик 🥙", sales: 156, revenue: "2,340.00", trend: "+12%" },
    { name: "Кофе Американо ☕", sales: 89, revenue: "445.00", trend: "+8%" },
    { name: "Мемный Бургер 🍔", sales: 67, revenue: "1,675.00", trend: "+25%" },
    { name: "Пицца Абеба 🍕", sales: 45, revenue: "1,125.00", trend: "+15%" },
  ]

  const recentCustomers = [
    { name: "@memefan", orders: 23, spent: "1,150.50", status: "VIP", avatar: "🤴" },
    { name: "@cryptobro", orders: 15, spent: "750.25", status: "Gold", avatar: "👨‍💻" },
    { name: "@foodlover", orders: 12, spent: "600.00", status: "Silver", avatar: "🍕" },
    { name: "@student", orders: 8, spent: "240.00", status: "Bronze", avatar: "🎓" },
  ]

  const salesData = [
    { day: "Пн", value: 1200 },
    { day: "Вт", value: 1800 },
    { day: "Ср", value: 1500 },
    { day: "Чт", value: 2200 },
    { day: "Пт", value: 2800 },
    { day: "Сб", value: 3200 },
    { day: "Вс", value: 2100 },
  ]
  const maxSales = Math.max(...salesData.map((d) => d.value))

  const categorySales = [
    { name: "Еда и напитки", value: 6000, color: "bg-orange-500" },
    { name: "Напитки", value: 3000, color: "bg-blue-500" },
    { name: "Услуги", value: 2000, color: "bg-purple-500" },
    { name: "Другое", value: 1847, color: "bg-gray-500" },
  ]
  const totalCategorySales = categorySales.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change} за неделю</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-green-400" />
              Продажи за неделю
            </CardTitle>
            <CardDescription className="text-purple-300">Динамика выручки по дням</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 text-purple-300 text-sm">{data.day}</div>
                  <div className="flex-1">
                    <Progress value={(data.value / maxSales) * 100} className="h-2" />
                  </div>
                  <div className="w-20 text-right text-white text-sm">{data.value} ABEBA</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
              Продажи по категориям
            </CardTitle>
            <CardDescription className="text-purple-300">Распределение выручки по основным категориям</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySales.map((category, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                    <span className="text-white">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">{category.value} ABEBA</span>
                    <span className="text-sm text-purple-300 ml-2">
                      {((category.value / totalCategorySales) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Топ клиенты
            </CardTitle>
            <CardDescription className="text-purple-300">Самые активные покупатели</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-500/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{customer.avatar}</div>
                    <div>
                      <div className="text-white font-medium">{customer.name}</div>
                      <div className="text-sm text-purple-300">{customer.orders} заказов</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{customer.spent} ABEBA</div>
                    <Badge
                      variant="secondary"
                      className={
                        customer.status === "VIP"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : customer.status === "Gold"
                            ? "bg-orange-500/20 text-orange-400"
                            : customer.status === "Silver"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-amber-600/20 text-amber-400"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Производительность
            </CardTitle>
            <CardDescription className="text-purple-300">Ключевые показатели эффективности</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-300">Цель месяца</span>
                <span className="text-white">15,000 ABEBA</span>
              </div>
              <Progress value={85.6} className="h-3" />
              <p className="text-sm text-green-400 mt-1">12,847 / 15,000 ABEBA (85.6%)</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-300">Новые клиенты</span>
                <span className="text-white">50 человек</span>
              </div>
              <Progress value={72} className="h-3" />
              <p className="text-sm text-blue-400 mt-1">36 / 50 человек (72%)</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-300">Рейтинг качества</span>
                <span className="text-white">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-3" />
              <p className="text-sm text-yellow-400 mt-1">Отличная работа! 🌟</p>
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent whitespace-nowrap">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт PDF
                </Button>
                <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent whitespace-nowrap">
                  <Calendar className="w-4 h-4 mr-2" />
                  За период
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Топ продавец</h3>
            <p className="text-sm text-yellow-300">В категории "Еда" этого месяца</p>
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400">🏆 Достижение</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 mx-auto text-green-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Быстрые продажи</h3>
            <p className="text-sm text-green-300">Средняя скорость обслуживания: 2.3 мин</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400">⚡ Молния</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto text-purple-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Высокий рейтинг</h3>
            <p className="text-sm text-purple-300">4.9/5.0 от клиентов</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400">⭐ Качество</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
