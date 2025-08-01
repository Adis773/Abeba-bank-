"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Printer, Share2, QrCode, Store } from "lucide-react"
import Image from "next/image"

interface BusinessMaterialsProps {
  businessName: string
  isOpen: boolean
  onClose: () => void
}

export function BusinessMaterials({ businessName, isOpen, onClose }: BusinessMaterialsProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)

  const materials = [
    {
      id: "sticker",
      name: "Наклейка на витрину",
      description: "Покажи клиентам что принимаешь ABEBA",
      size: "A4 (210×297mm)",
      format: "PDF, PNG",
      preview: "/abeba-logo.png",
    },
    {
      id: "table-tent",
      name: "Настольная табличка",
      description: "Поставь на стол или кассу",
      size: "10×15cm",
      format: "PDF",
      preview: "/abeba-logo.png",
    },
    {
      id: "qr-poster",
      name: "QR-код постер",
      description: "Большой QR для быстрой оплаты",
      size: "A3 (297×420mm)",
      format: "PDF, PNG",
      preview: "/abeba-logo.png",
    },
    {
      id: "business-card",
      name: "Визитка",
      description: "Раздавай клиентам",
      size: "85×55mm",
      format: "PDF",
      preview: "/abeba-logo.png",
    },
  ]

  const generateMaterial = (materialId: string) => {
    // В реальном приложении здесь будет генерация PDF/PNG
    console.log(`Generating ${materialId} for ${businessName}`)

    // Имитация скачивания
    const link = document.createElement("a")
    link.href = "/abeba-logo.png" // В реальности будет сгенерированный файл
    link.download = `${businessName}-${materialId}.pdf`
    link.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Store className="w-6 h-6 mr-2 text-purple-400" />
            Материалы для бизнеса
          </DialogTitle>
          <p className="text-purple-300">Скачай и распечатай материалы для привлечения клиентов</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Banner Preview */}
          <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image src="/abeba-logo.png" alt="ABEBA" width={60} height={60} />
                  <div>
                    <h3 className="text-2xl font-bold text-white">ABEBA уже здесь! 🦆</h3>
                    <p className="text-yellow-200">Быстрая оплата здесь</p>
                    <Badge className="bg-green-500/20 text-green-400 mt-1">0% комиссии</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                  <p className="text-xs text-yellow-300 mt-1">Сканируй и плати</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((material) => (
              <Card
                key={material.id}
                className="bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Image src={material.preview || "/placeholder.svg"} alt={material.name} width={40} height={40} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{material.name}</h4>
                      <p className="text-sm text-purple-300 mb-2">{material.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {material.size}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {material.format}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => generateMaterial(material.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Скачать
                        </Button>
                        <Button variant="outline" size="sm" className="border-purple-500/30 bg-transparent">
                          <Printer className="w-3 h-3 mr-1" />
                          Печать
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300 text-lg">Как использовать материалы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <p className="text-blue-200">Скачай нужные материалы в высоком качестве</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <p className="text-blue-200">Распечатай на цветном принтере или в типографии</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <p className="text-blue-200">Размести в видном месте для клиентов</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <p className="text-blue-200">Получай больше клиентов и продаж! 🚀</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose} className="border-purple-500/30 bg-transparent">
              Закрыть
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться с командой
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
