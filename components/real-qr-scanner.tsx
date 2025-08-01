"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { QrCode, XCircle, CameraOff } from 'lucide-react'
import jsQR from "jsqr"

interface RealQRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (data: any) => void
}

export function RealQRScanner({ isOpen, onClose, onScan }: RealQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      startScanner()
    } else {
      stopScanner()
    }

    return () => stopScanner()
  }, [isOpen])

  const startScanner = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute("playsinline", "true") // Важно для iOS
        videoRef.current.crossOrigin = "anonymous" // Для предотвращения CORS ошибок при чтении пикселей
        await videoRef.current.play()
        setScanning(true)
        requestAnimationFrame(tick)
      }
    } catch (err) {
      console.error("Ошибка доступа к камере:", err)
      setError("Не удалось получить доступ к камере. Пожалуйста, разрешите доступ.")
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      ;(videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
    }
    setScanning(false)
  }

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })

        if (code) {
          console.log("QR Code detected:", code.data)
          onScan({ data: code.data, paymentUrl: code.data.startsWith("http") ? code.data : null })
          stopScanner()
          return // Останавливаем сканирование после успешного распознавания
        }
      }
    }

    if (scanning) {
      requestAnimationFrame(tick)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/70 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-purple-400" />
            Сканировать QR-код
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Наведите камеру на QR-код для оплаты или получения информации.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 text-center p-4">
              <CameraOff className="w-12 h-12 mb-4" />
              <p>{error}</p>
              <Button onClick={startScanner} className="mt-4 bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                Попробовать снова
              </Button>
            </div>
          ) : (
            <>
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"></video>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white text-lg">Загрузка камеры...</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-300 bg-transparent whitespace-nowrap">
            <XCircle className="w-4 h-4 mr-2" />
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
