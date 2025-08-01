"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, CheckCircle, X, Zap, Info } from 'lucide-react'

interface RealNFCPaymentProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  recipient: string
  onPayment: (success: boolean, txHash?: string) => void
}

// Объявляем NDEFReader глобально, если он не определен в tsconfig.json
declare global {
  interface Window {
    NDEFReader?: any // Используем any для простоты демо
  }
}

export function RealNFCPayment({ isOpen, onClose, amount, recipient, onPayment }: RealNFCPaymentProps) {
  const [nfcSupported, setNfcSupported] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState("")
  const [nfcDataRead, setNfcDataRead] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle")

  useEffect(() => {
    // Проверяем поддержку NFC
    if (typeof window !== "undefined" && "NDEFReader" in window) {
      setNfcSupported(true)
    } else {
      setError("NFC не поддерживается на этом устройстве или в браузере (только Chrome на Android).")
    }
  }, [])

  const startNFCReading = async () => {
    if (!nfcSupported) {
      setError("NFC не поддерживается на этом устройстве.")
      return
    }

    try {
      setIsReading(true)
      setError("")
      setNfcDataRead(null)
      setPaymentStatus("processing")

      const ndef = new window.NDEFReader()

      ndef.addEventListener("reading", async ({ message, serialNumber }: { message: any; serialNumber: string }) => {
        console.log(`NFC tag read: ${serialNumber}`)
        let dataContent = ""
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding)
            dataContent += textDecoder.decode(record.data) + "\n"
          } else if (record.recordType === "url") {
            const urlDecoder = new TextDecoder()
            dataContent += urlDecoder.decode(record.data) + "\n"
          }
          // Можно добавить обработку других типов записей
        }
        setNfcDataRead(dataContent || "Данные прочитаны, но не текстовые/URL.")

        // Имитация обработки данных с тега для платежа
        // В реальном приложении здесь была бы логика парсинга данных и вызова API
        const demoNfcPaymentData = {
          type: "abeba_payment_demo",
          amount: amount, // Используем сумму из пропсов для демо-платежа
          recipient: recipient, // Используем получателя из пропсов
          cardId: serialNumber,
          readContent: dataContent,
        }
        await processNFCPayment(demoNfcPaymentData)
        ndef.cancelScan() // Останавливаем сканирование после успешного чтения
      })

      ndef.addEventListener("readingerror", () => {
        setError("Ошибка чтения NFC тега. Попробуйте снова.")
        setIsReading(false)
        setPaymentStatus("failed")
      })

      await ndef.scan()
      console.log("NFC сканирование запущено.")
    } catch (error) {
      console.error("NFC error:", error)
      setError("Не удалось запустить NFC сканер. Проверьте разрешения.")
      setIsReading(false)
      setPaymentStatus("failed")
    }
  }

  const processNFCPayment = async (nfcData: any) => {
    try {
      // Отправляем платеж на серверный API (это по-прежнему демо-API)
      const response = await fetch("/api/nfc-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: nfcData.amount,
          recipient: nfcData.recipient,
          nfcData: nfcData.readContent,
          cardId: nfcData.cardId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentStatus("completed")
        onPayment(true, result.txHash)
      } else {
        setError(result.error || "Ошибка обработки NFC платежа.")
        setPaymentStatus("failed")
        onPayment(false)
      }
    } catch (error) {
      setError("Ошибка обработки платежа на сервере.")
      setPaymentStatus("failed")
      onPayment(false)
    } finally {
      setIsReading(false)
    }
  }

  const writeNFCTag = async () => {
    if (!nfcSupported) {
      setError("NFC не поддерживается на этом устройстве.")
      return
    }

    try {
      const ndef = new window.NDEFReader()
      const dataToWrite = `abeba.bank/pay?amount=${amount}&recipient=${recipient}`

      await ndef.write({
        records: [
          {
            recordType: "url",
            data: dataToWrite,
          },
        ],
      })

      alert(`Данные успешно записаны на NFC тег (ДЕМО)! URL: ${dataToWrite}`)
    } catch (error) {
      console.error("NFC write error:", error)
      setError("Не удалось записать данные на NFC тег. Убедитесь, что тег пуст и доступен для записи.")
    }
  }

  const handleClose = () => {
    setIsReading(false)
    setError("")
    setNfcDataRead(null)
    setPaymentStatus("idle")
    onClose()
  }

  if (!nfcSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-red-400">
              <X className="w-5 h-5 mr-2" />
              NFC недоступен
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <div className="py-8">
              <Smartphone className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">NFC не поддерживается</h3>
              <p className="text-red-300 text-sm">{error}</p>
              <p className="text-purple-300 text-xs mt-2">
                Web NFC API работает только в Chrome на Android и требует HTTPS.
              </p>
            </div>

            <Button variant="outline" onClick={handleClose} className="w-full border-purple-500/30 bg-transparent">
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Wifi className="w-5 h-5 mr-2 text-blue-400" />
            NFC Оплата
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Info */}
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{amount} ABEBA</div>
                <div className="text-blue-300">для {recipient}</div>
              </div>
            </CardContent>
          </Card>

          {paymentStatus === "idle" && (
            <div className="text-center space-y-4">
              <div className="py-8">
                <Smartphone className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Готов к NFC оплате</h3>
                <p className="text-purple-300 text-sm">Приложите NFC карту или устройство для оплаты</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={startNFCReading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 whitespace-nowrap"
                >
                  <Wifi className="w-5 h-5 mr-2" />
                  Начать NFC сканирование
                </Button>

                <Button
                  variant="outline"
                  onClick={writeNFCTag}
                  className="w-full border-purple-500/30 bg-transparent whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Записать на NFC тег (ДЕМО)
                </Button>
              </div>
            </div>
          )}

          {paymentStatus === "processing" && (
            <div className="text-center space-y-4">
              <div className="py-8">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Сканирование NFC...</h3>
                <p className="text-blue-300 text-sm">Приложите NFC карту к устройству</p>
              </div>

              <Badge className="bg-blue-500/20 text-blue-400 whitespace-nowrap">NFC сканер активен</Badge>
            </div>
          )}

          {paymentStatus === "completed" && (
            <div className="text-center space-y-4">
              <div className="py-8">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">NFC оплата успешна!</h3>
                <p className="text-green-300 text-sm">Транзакция успешно завершена.</p>
              </div>

              {nfcDataRead && (
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="p-3">
                    <div className="text-sm text-green-200">
                      <Info className="w-4 h-4 inline mr-1" /> Прочитанные данные:
                      <pre className="text-xs mt-1 break-all whitespace-pre-wrap">{nfcDataRead}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="text-center space-y-4">
              <div className="py-8">
                <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">NFC оплата не удалась</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button variant="link" onClick={handleClose} className="text-purple-400">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
