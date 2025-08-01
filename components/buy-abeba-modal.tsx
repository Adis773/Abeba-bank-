"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Smartphone, Building, TrendingUp, AlertCircle } from "lucide-react"
import Image from "next/image"

interface BuyAbebaModalProps {
  isOpen: boolean
  onClose: () => void
  onBuy: (amount: number, paymentMethod: string) => void
  currentPrice: number
}

export function BuyAbebaModal({ isOpen, onClose, onBuy, currentPrice }: BuyAbebaModalProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const paymentMethods = [
    { id: "card", name: "Банковская карта", icon: CreditCard, fee: "0%" },
    { id: "sbp", name: "СБП (Быстрые платежи)", icon: Smartphone, fee: "0%" },
    { id: "bank", name: "Банковский перевод", icon: Building, fee: "0%" },
  ]

  const quickAmounts = [100, 500, 1000, 5000]

  const handleBuy = async () => {
    if (!amount || !paymentMethod) return

    setIsLoading(true)
    // Имитация покупки
    setTimeout(() => {
      onBuy(Number.parseFloat(amount), paymentMethod)
      setIsLoading(false)
      setAmount("")
      setPaymentMethod("")
    }, 2000)
  }

  const usdAmount = Number.parseFloat(amount || "0") * currentPrice

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Image src="/abeba-logo.png" alt="ABEBA" width={32} height={32} className="mr-2" />
            Купить ABEBA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Price */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-300">Текущая цена</div>
                  <div className="text-2xl font-bold text-white">${currentPrice.toFixed(4)}</div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </Badge>
                  <div className="text-xs text-green-300 mt-1">за 24ч</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-4">
            <div>
              <Label className="text-white">Количество ABEBA</Label>
              <Input
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-purple-900/20 border-purple-500/30 text-white text-lg"
              />
              {amount && <div className="text-sm text-purple-300 mt-1">≈ ${usdAmount.toFixed(2)} USD</div>}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="border-purple-500/30 text-purple-300 bg-transparent hover:bg-purple-500/20"
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-white">Способ оплаты</Label>
            <div className="space-y-2 mt-2">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? "bg-purple-500/20 border-purple-400"
                      : "bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30"
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <method.icon className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{method.name}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{method.fee}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="text-xs text-yellow-200">
                <strong>Важно:</strong> Покупка криптовалюты связана с рисками. Инвестируйте только те средства, которые
                готовы потерять. ABEBA - мемный токен! 🦆
              </div>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handleBuy}
            disabled={!amount || !paymentMethod || isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg py-3"
          >
            {isLoading ? "Обрабатываем покупку..." : `Купить ${amount || "0"} ABEBA 🚀`}
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={onClose} className="text-purple-400">
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
