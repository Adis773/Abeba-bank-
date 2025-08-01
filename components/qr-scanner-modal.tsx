"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle } from "lucide-react"

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const startScanning = () => {
    setIsScanning(true)
    // Имитация сканирования QR-кода
    setTimeout(() => {
      setScannedData({
        recipient: "@coffeeshop",
        recipientName: "Мемная Кофейня",
        amount: 75,
        description: "Кофе американо ☕",
        paymentUrl: "https://abeba.bank/pay/12345?amount=75&desc=coffee",
        isVerified: true,
      })
      setIsScanning(false)
    }, 3000)
  }

  const handlePay = () => {
    setIsPaying(true)
    // Имитация оплаты
    setTimeout(() => {
      setIsPaying(false)
      setPaymentComplete(true)
      setTimeout(() => {
        onClose()
        setScannedData(null)
        setPaymentComplete(false)
      }, 2000)
    }, 2000)
  }

  const resetScanner = () => {
    setScannedData(null)
    setPaymentComplete(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <QrCode className="w-5 h-5 mr-2 text-orange-400" />
            Сканировать QR-код
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!scannedData && !isScanning && (
            <>
              <div className="text-center py-8">
                <Camera className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Готов к сканированию</h3>
                <p className="text-purple-300 text-sm">Наведи камеру на QR-код для оплаты</p>
              </div>

              <Button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg py-3"
              >
                <Camera className="w-5 h-5 mr-2" />
                Включить камеру 📸
              </Button>
            </>
          )}

          {isScanning && (
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto bg-purple-900/20 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center mb-4">
                <div className="animate-pulse">
                  <QrCode className="w-24 h-24 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Сканируем QR-код...</h3>
              <p className="text-purple-300 text-sm">Держи камеру ровно 📱</p>
            </div>
          )}

          {scannedData && !paymentComplete && (
            <>
              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{scannedData.recipientName}</h3>
                    {scannedData.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Проверен
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-300">Получатель:</span>
                      <span className="text-white">{scannedData.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Сумма:</span>
                      <span className="text-white font-bold">{scannedData.amount} ABEBA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">За что:</span>
                      <span className="text-white">{scannedData.description}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm">Комиссия: 0% 🔥</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handlePay}
                  disabled={isPaying}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isPaying ? "Оплачиваем..." : `Оплатить ${scannedData.amount} ABEBA 🚀`}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-purple-500/30 text-purple-300 bg-transparent"
                >
                  Отмена
                </Button>
              </div>
            </>
          )}

          {paymentComplete && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🎉 Оплачено!</h3>
              <p className="text-green-300">Транзакция успешно завершена</p>
              <div className="text-2xl mt-2">🦆💸</div>
            </div>
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
