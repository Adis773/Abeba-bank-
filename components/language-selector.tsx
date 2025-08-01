"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Globe, Search, Check } from "lucide-react"
import { languages } from "@/lib/i18n"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (lang: string) => void
  isOpen: boolean
  onClose: () => void
}

export function LanguageSelector({ currentLanguage, onLanguageChange, isOpen, onClose }: LanguageSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode)
    localStorage.setItem("abeba_language", langCode)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Globe className="w-5 h-5 mr-2 text-blue-400" />
            Select Language / Выберите язык
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-purple-900/20 border-purple-500/30 text-white pl-10"
            />
          </div>

          {/* Language List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredLanguages.map((lang) => (
              <Card
                key={lang.code}
                className={`cursor-pointer transition-colors ${
                  currentLanguage === lang.code
                    ? "bg-purple-500/20 border-purple-400"
                    : "bg-purple-900/20 border-purple-500/20 hover:bg-purple-800/30"
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="text-white font-medium">{lang.name}</div>
                        <div className="text-sm text-purple-300">{lang.code.toUpperCase()}</div>
                      </div>
                    </div>
                    {currentLanguage === lang.code && <Check className="w-5 h-5 text-green-400" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="link" onClick={onClose} className="text-purple-400">
              Close / Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
