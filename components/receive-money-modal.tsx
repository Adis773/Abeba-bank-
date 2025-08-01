"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Copy, Share2, Download } from "lucide-react"

interface ReceiveMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function ReceiveMoneyModal({ isOpen, onClose, user }: ReceiveMoneyModalProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)

  const generateQR = () => {
    setQrGenerated(true)
  }

  const paymentLink = `https://abeba.bank/pay/${user.id}?amount=${amount}&desc=${encodeURIComponent(description)}`

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink)
    // Можно добавить уведомление
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Оплата через ABEBA",
        text: description || "Оплати мне через ABEBA банк!",
        url: paymentLink,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <QrCode className="w-5 h-5 mr-2 text-purple-400" />
            Получить ABEBA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!qrGenerated ? (
            <>
              {/* Amount */}
              <div>
                <Label className="text-white">Сумма (опционально)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-purple-900/20 border-purple-500/30 text-white text-lg"
                />
                <p className="text-xs text-purple-300 mt-1">Оставь пустым, если сумму выберет отправитель</p>
              </div>

              {/* Description */}
              <div>
                <Label className="text-white">Описание</Label>
                <Textarea
                  placeholder="За что платят? (например: За кофе ☕)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-purple-900/20 border-purple-500/30 text-white"
                  rows={2}
                />
              </div>

              <Button
                onClick={generateQR}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-3"
              >
                Создать QR-код 🦆
              </Button>
            </>
          ) : (
            <>
              {/* QR Code */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50">
                <CardContent className="p-6 text-center">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-black" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{description || "Оплата через ABEBA"}</h3>
                    {amount && <div className="text-2xl font-bold text-purple-300">{amount} ABEBA</div>}
                    <div className="text-sm text-purple-200">
                      Для: {user.name} ({user.phone})
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="border-purple-500/30 text-purple-300 bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Копировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareLink}
                  className="border-purple-500/30 text-purple-300 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Поделиться
                </Button>
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 bg-transparent">
                  <Download className="w-4 h-4 mr-1" />
                  Скачать
                </Button>
              </div>

              {/* Payment Link */}
              <div>
                <Label className="text-white text-sm">Ссылка для оплаты:</Label>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mt-1">
                  <code className="text-purple-200 text-xs break-all">{paymentLink}</code>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setQrGenerated(false)}
                className="w-full border-purple-500/30 text-purple-300 bg-transparent"
              >
                Создать новый QR
              </Button>
            </>
          )}

          <div className="text-center">
            <Button variant="link" onClick={onClose} className="text-purple-400">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
