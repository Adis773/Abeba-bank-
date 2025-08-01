"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Send, User, AlertCircle } from "lucide-react"

interface SendMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (amount: number, recipient: string, description: string) => void
  currentBalance: number
}

export function SendMoneyModal({ isOpen, onClose, onSend, currentBalance }: SendMoneyModalProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!amount || !recipient) return

    const sendAmount = Number.parseFloat(amount)
    if (sendAmount > currentBalance) return

    setIsLoading(true)
    setTimeout(() => {
      onSend(sendAmount, recipient, description || "Перевод ABEBA 🦆")
      setIsLoading(false)
      setAmount("")
      setRecipient("")
      setDescription("")
    }, 1500)
  }

  const quickAmounts = [10, 50, 100, 500]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Send className="w-5 h-5 mr-2 text-blue-400" />
            Отправить ABEBA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-sm text-blue-300">Доступно для отправки</div>
            <div className="text-xl font-bold text-white">{currentBalance.toFixed(2)} ABEBA</div>
          </div>

          {/* Recipient */}
          <div>
            <Label className="text-white">Получатель</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
              <Input
                placeholder="@username или номер телефона"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-purple-900/20 border-purple-500/30 text-white pl-10"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label className="text-white">Сумма ABEBA</Label>
            <Input
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-purple-900/20 border-purple-500/30 text-white text-lg"
            />

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2 mt-2">
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

          {/* Description */}
          <div>
            <Label className="text-white">Комментарий (опционально)</Label>
            <Textarea
              placeholder="За что переводишь? 🤔"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-purple-900/20 border-purple-500/30 text-white"
              rows={2}
            />
          </div>

          {/* Warning if insufficient balance */}
          {Number.parseFloat(amount || "0") > currentBalance && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-sm text-red-200">
                  Недостаточно средств! У тебя только {currentBalance.toFixed(2)} ABEBA
                </div>
              </div>
            </div>
          )}

          {/* Fee info */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-green-300 text-sm">Комиссия за перевод:</span>
              <Badge className="bg-green-500/20 text-green-400">0% 🔥</Badge>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!amount || !recipient || Number.parseFloat(amount || "0") > currentBalance || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg py-3"
          >
            {isLoading ? "Отправляем..." : `Отправить ${amount || "0"} ABEBA 🚀`}
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
