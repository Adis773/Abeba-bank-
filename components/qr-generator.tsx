"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { QrCode, Copy, Share2, Download, Sparkles } from "lucide-react"

export function QRGenerator() {
  const [qrData, setQrData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "general",
  })
  const [generatedQR, setGeneratedQR] = useState(false)

  const categories = [
    { id: "general", name: "Общее", icon: "💰", color: "bg-blue-500" },
    { id: "donation", name: "Донаты", icon: "💝", color: "bg-pink-500" },
    { id: "coffee", name: "На кофе", icon: "☕", color: "bg-amber-500" },
    { id: "food", name: "На еду", icon: "🍕", color: "bg-orange-500" },
    { id: "tips", name: "Чаевые", icon: "🎩", color: "bg-purple-500" },
    { id: "charity", name: "Благотворительность", icon: "🤝", color: "bg-green-500" },
  ]

  const handleGenerate = () => {
    if (qrData.title && qrData.amount) {
      setGeneratedQR(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <QrCode className="w-6 h-6 mr-2 text-purple-400" />
            Создать QR для приёма оплаты
          </CardTitle>
          <CardDescription className="text-purple-300">Создай свой мемный QR-код за 30 секунд! 🚀</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Название цели
                </Label>
                <Input
                  id="title"
                  placeholder="На шавуху 🥙"
                  value={qrData.title}
                  onChange={(e) => setQrData({ ...qrData, title: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-white">
                  Сумма (ABEBA)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100.00"
                  value={qrData.amount}
                  onChange={(e) => setQrData({ ...qrData, amount: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label className="text-white">Категория</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={qrData.category === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQrData({ ...qrData, category: cat.id })}
                      className={`${qrData.category === cat.id ? cat.color : "border-purple-500/30"} text-white`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Описание (опционально)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Помогите собрать на велосипед для поездок по городу! 🚴‍♂️"
                  value={qrData.description}
                  onChange={(e) => setQrData({ ...qrData, description: e.target.value })}
                  className="bg-purple-900/20 border-purple-500/30 text-white placeholder:text-purple-300"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!qrData.title || !qrData.amount}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Создать абебный QR! 🚀
              </Button>
            </div>

            {generatedQR && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="w-32 h-32 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{qrData.title}</h3>
                    <div className="text-2xl font-bold text-purple-300 mb-2">{qrData.amount} ABEBA</div>
                    {qrData.description && <p className="text-sm text-purple-200 mb-4">{qrData.description}</p>}
                    <Badge className={categories.find((c) => c.id === qrData.category)?.color}>
                      {categories.find((c) => c.id === qrData.category)?.icon}{" "}
                      {categories.find((c) => c.id === qrData.category)?.name}
                    </Badge>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 bg-transparent">
                    <Copy className="w-4 h-4 mr-1" />
                    Копировать
                  </Button>
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 bg-transparent">
                    <Share2 className="w-4 h-4 mr-1" />
                    Поделиться
                  </Button>
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 bg-transparent">
                    <Download className="w-4 h-4 mr-1" />
                    Скачать
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-purple-300 mb-2">Ссылка для отправки:</p>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                    <code className="text-purple-200 text-sm break-all">
                      https://abeba.bank/pay/@adisshop/{qrData.title.replace(/\s+/g, "-").toLowerCase()}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Быстрые шаблоны</CardTitle>
          <CardDescription className="text-purple-300">Популярные цели для сбора денег</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "На кофе", amount: "5.00", icon: "☕", desc: "Угости меня кофе!" },
              { title: "Чаевые", amount: "10.00", icon: "🎩", desc: "За хорошее обслуживание" },
              { title: "Донат стримеру", amount: "25.00", icon: "🎮", desc: "Поддержи контент!" },
            ].map((template, i) => (
              <Card
                key={i}
                className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30 cursor-pointer transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <h4 className="font-bold text-white">{template.title}</h4>
                  <p className="text-purple-300 text-sm mb-2">{template.desc}</p>
                  <Badge variant="secondary">{template.amount} ABEBA</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
