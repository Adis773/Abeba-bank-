"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "sonner"

interface PaymentPageProps {
  searchParams: {
    merchant?: string
    amount?: string
    currency?: string
    description?: string
    returnUrl?: string
  }
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  })

  const amount = parseFloat(searchParams.amount || '0')
  const currency = searchParams.currency || 'USD'
  const merchantId = searchParams.merchant || 'demo_merchant'
  const description = searchParams.description || 'Покупка'
  const returnUrl = searchParams.returnUrl

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    // Форматирование номера карты
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19)
    }

    // Форматирование срока действия
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4)
      }
    }

    // Форматирование CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3)
    }

    // Форматирование имени держателя
    if (field === 'cardHolder') {
      formattedValue = value.toUpperCase()
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
  }

  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Введите корректный номер карты')
      return false
    }

    if (!formData.cardHolder.trim()) {
      toast.error('Введите имя держателя карты')
      return false
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      toast.error('Введите корректный срок действия (MM/YY)')
      return false
    }

    if (!formData.cvv || formData.cvv.length !== 3) {
      toast.error('Введите корректный CVV код')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setPaymentStatus('processing')

    try {
      const response = await fetch('/api/abeba-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: formData.cardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          amount,
          currency,
          merchantId,
          description,
          returnUrl
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentStatus('success')
        setTransactionId(result.transactionId)
        toast.success('Платеж успешно проведен!')
        
        // Редирект после успешной оплаты
        if (returnUrl) {
          setTimeout(() => {
            window.parent.postMessage({
              type: 'ABEBA_PAYMENT_SUCCESS',
              transactionId: result.transactionId,
              amount,
              currency
            }, '*')
          }, 2000)
        }
      } else {
        setPaymentStatus('error')
        setErrorMessage(result.message || 'Ошибка при обработке платежа')
        toast.error(result.message || 'Ошибка при обработке платежа')
      }
    } catch (error) {
      setPaymentStatus('error')
      setErrorMessage('Ошибка сети. Попробуйте позже.')
      toast.error('Ошибка сети. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setPaymentStatus('idle')
    setErrorMessage('')
    setTransactionId('')
    setFormData({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    })
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Платеж успешен! 🎉
              </h2>
              
              <p className="text-gray-600 mb-4">
                Ваш платеж на сумму <strong>{amount} {currency}</strong> успешно обработан
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">ID транзакции:</p>
                <p className="font-mono text-sm text-gray-800 break-all">{transactionId}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>✅ Средства списаны с ABEBA-карты</p>
                <p>✅ Продавец получит уведомление</p>
                <p>✅ Чек отправлен на email</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <XCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ошибка платежа
              </h2>
              
              <p className="text-red-600 mb-6">
                {errorMessage}
              </p>
              
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Попробовать снова
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-lg">A</span>
            </motion.div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ABEBA Payment
            </CardTitle>
            <p className="text-sm text-gray-600">Безопасная оплата ABEBA-картой</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Информация о платеже */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Сумма к оплате:</span>
                <span className="text-xl font-bold text-purple-600">{amount} {currency}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Продавец:</span>
                <span className="text-sm font-medium">{merchantId}</span>
              </div>
              <div className="text-sm text-gray-600">{description}</div>
            </div>

            {/* Форма оплаты */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Номер ABEBA-карты
                </label>
                <Input
                  type="text"
                  placeholder="4444 1111 2222 3333"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="font-mono"
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Срок действия</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="font-mono"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="font-mono"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Имя держателя карты</label>
                <Input
                  type="text"
                  placeholder="ABEBA USER"
                  value={formData.cardHolder}
                  onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Кнопка оплаты */}
              <Button
                type="submit"
                disabled={loading || paymentStatus === 'processing'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 font-semibold"
              >
                {loading || paymentStatus === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обработка платежа...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Оплатить {amount} {currency}
                  </>
                )}
              </Button>
            </form>

            {/* Информация о безопасности */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p className="flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" />
                Защищено шифрованием SSL
              </p>
              <p>🛡️ Швейцарские стандарты безопасности</p>
              <p>💳 Работает только с ABEBA-картами</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}