"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Smartphone, Building, TrendingUp, AlertCircle, ExternalLink } from "lucide-react"
import Image from "next/image"

interface RealBuyAbebaModalProps {
  isOpen: boolean
  onClose: () => void
  onBuy: (amount: number, paymentMethod: string, txHash: string) => void
  currentPrice: number
}

export function RealBuyAbebaModal({ isOpen, onClose, onBuy, currentPrice }: RealBuyAbebaModalProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const paymentMethods = [
    {
      id: "card",
      name: "Банковская карта",
      icon: CreditCard,
      fee: "2.9%",
      description: "Visa, MasterCard, МИР",
    },
    {
      id: "crypto",
      name: "Криптовалюта",
      icon: Building,
      fee: "0.5%",
      description: "USDT, BTC, ETH",
    },
    {
      id: "sbp",
      name: "СБП",
      icon: Smartphone,
      fee: "1%",
      description: "Быстрые платежи",
    },
  ]

  const quickAmounts = [100, 500, 1000, 5000]

  const handleBuyClick = () => {
    if (!amount || !paymentMethod) return
    setShowPayment(true)
  }

  const processRealPayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          paymentMethod,
          tokenAmount: Number.parseFloat(amount),
          pricePerToken: currentPrice,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Реальная покупка прошла успешно
        onBuy(Number.parseFloat(amount), paymentMethod, result.txHash)
        setShowPayment(false)
        onClose()
      } else {
        alert(`Ошибка оплаты: ${result.error}`)
      }
    } catch (error) {
      alert("Ошибка при обработке платежа")
    } finally {
      setIsLoading(false)
    }
  }

  const usdAmount = Number.parseFloat(amount || "0") * currentPrice

  if (showPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Оплата {amount} ABEBA</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">${usdAmount.toFixed(2)} USD</div>
                  <div className="text-blue-300">за {amount} ABEBA</div>
                  <div className="text-sm text-blue-200 mt-2">
                    Комиссия: {paymentMethods.find((p) => p.id === paymentMethod)?.fee}
                  </div>
                </div>
              </CardContent>
            </Card>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Номер карты</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    className="bg-purple-900/20 border-purple-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">MM/YY</Label>
                    <Input placeholder="12/25" className="bg-purple-900/20 border-purple-500/30 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">CVC</Label>
                    <Input placeholder="123" className="bg-purple-900/20 border-purple-500/30 text-white" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="text-yellow-300 text-sm">
                    <strong>Отправьте ${usdAmount.toFixed(2)} USDT на адрес:</strong>
                  </div>
                  <div className="bg-black/20 rounded p-2 mt-2">
                    <code className="text-yellow-100 text-xs break-all">TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</code>
                  </div>
                  <div className="text-yellow-200 text-xs mt-2">
                    После подтверждения транзакции ABEBA поступят на ваш кошелек
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "sbp" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                    <div className="text-black text-xs">QR для СБП</div>
                  </div>
                  <div className="text-purple-300 text-sm">Отсканируйте QR-код в приложении банка</div>
                </div>
              </div>
            )}

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-xs text-red-200">
                  <strong>Внимание:</strong> Это реальная покупка! Деньги будут списаны с вашего счета. ABEBA -
                  высокорисковый актив. Инвестируйте ответственно!
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={processRealPayment}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isLoading ? "Обрабатываем платеж..." : `Оплатить $${usdAmount.toFixed(2)}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="border-purple-500/30 bg-transparent"
              >
                Назад
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Image src="/abeba-logo.png" alt="ABEBA" width={32} height={32} className="mr-2" />
            Купить ABEBA (реально)
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
                    Live цена
                  </Badge>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-green-300 p-0 h-auto"
                    onClick={() =>
                      window.open("https://pump.fun/21CcDkerURgWdE7YfCLfhas7TdVXnpE22kjAAMEzpump", "_blank")
                    }
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Pump.fun
                  </Button>
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
                        <div>
                          <span className="text-white">{method.name}</span>
                          <div className="text-xs text-purple-300">{method.description}</div>
                        </div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400">{method.fee}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
              <div className="text-xs text-red-200">
                <strong>РЕАЛЬНАЯ ПОКУПКА:</strong> Это не демо! Деньги будут списаны с вашего счета. ABEBA - мемкоин с
                высокими рисками. Можете потерять все деньги! 🚨
              </div>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handleBuyClick}
            disabled={!amount || !paymentMethod}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-lg py-3"
          >
            💰 КУПИТЬ ЗА РЕАЛЬНЫЕ ДЕНЬГИ ${usdAmount.toFixed(2)}
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
