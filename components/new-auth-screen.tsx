"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, User, Shield, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { UserAgreementModal } from "@/components/user-agreement-modal"
import { abebaCardSystem } from "@/lib/abeba-card-system"

interface NewAuthScreenProps {
  onLogin: (userData: any) => void
}

const securityQuestions = [
  "Как зовут вашу маму?",
  "Имя вашего лучшего друга из детства?",
  "Имя вашего первого учителя?",
  "Название вашей первой школы?",
  "Кличка вашего первого питомца?",
  "В каком городе вы родились?",
  "Девичья фамилия вашей мамы?",
  "Ваше любимое блюдо из детства?"
]

export function NewAuthScreen({ onLogin }: NewAuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [useFingerprint, setUseFingerprint] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showUserAgreement, setShowUserAgreement] = useState(false)
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    pinCode: "",
    confirmPinCode: "",
    securityAnswers: ["", "", ""],
    selectedQuestions: [0, 1, 2]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityAnswer = (index: number, value: string) => {
    const newAnswers = [...formData.securityAnswers]
    newAnswers[index] = value
    setFormData(prev => ({ ...prev, securityAnswers: newAnswers }))
  }

  const handleQuestionChange = (index: number, questionIndex: number) => {
    const newQuestions = [...formData.selectedQuestions]
    newQuestions[index] = questionIndex
    setFormData(prev => ({ ...prev, selectedQuestions: newQuestions }))
  }

  const handleLogin = async () => {
    setLoading(true)
    
    // Симуляция проверки данных
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const userData = {
      id: Date.now(),
      username: formData.username,
      balance: 1250.75,
      abebaBalance: 45.20,
      cardNumber: "4444 1111 2222 3333",
      cardHolder: "ABEBA USER",
      cardExpiry: "07/30",
      cardCVV: "123",
      hasFingerprint: useFingerprint,
      hasPinCode: formData.pinCode !== ""
    }
    
    setLoading(false)
    onLogin(userData)
  }

  const handleRegister = async () => {
    if (step < 4) {
      setStep(step + 1)
      return
    }
    
    setLoading(true)
    
    // Симуляция регистрации
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Создание ABEBA-карты для нового пользователя
    const userId = `user_${Date.now()}`
    const abebaCard = abebaCardSystem.createCard(userId, formData.username)
    
    // Пополнение карты бонусом за регистрацию
    abebaCardSystem.addBalance(abebaCard.cardNumber, 10.0)
    
    const userData = {
      id: userId,
      username: formData.username,
      balance: 10.0, // Бонус за регистрацию
      abebaBalance: 5.0, // Бонус ABEBA
      cardNumber: abebaCard.cardNumber,
      cardHolder: abebaCard.cardHolder,
      cardExpiry: abebaCard.expiryDate,
      cardCVV: abebaCard.cvv,
      hasFingerprint: useFingerprint,
      hasPinCode: formData.pinCode !== "",
      securityQuestions: formData.selectedQuestions.map(i => securityQuestions[i]),
      securityAnswers: formData.securityAnswers,
      abebaCardId: abebaCard.id
    }
    
    setLoading(false)
    onLogin(userData)
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">A</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ABEBA BANK
            </CardTitle>
            <p className="text-gray-600 text-sm">Банк будущего без границ</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Toggle Login/Register */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {setIsLogin(true); setStep(1)}}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin 
                    ? "bg-white text-purple-600 shadow-sm" 
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => {setIsLogin(false); setStep(1)}}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin 
                    ? "bg-white text-purple-600 shadow-sm" 
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Регистрация
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                // LOGIN FORM
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Имя пользователя</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Введите имя пользователя"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите пароль"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Google reCAPTCHA Placeholder */}
                  <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Checkbox
                      checked={captchaVerified}
                      onCheckedChange={setCaptchaVerified}
                    />
                    <span className="text-sm text-gray-600">Я не робот</span>
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                        rC
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={!formData.username || !formData.password || !captchaVerified || loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-full font-semibold"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Войти
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      Забыли пароль?
                    </button>
                  </div>
                </motion.div>
              ) : (
                // REGISTRATION FORM
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Step Indicator */}
                  <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <div
                        key={stepNum}
                        className={`w-3 h-3 rounded-full transition-all ${
                          stepNum === step
                            ? "bg-purple-500 w-8"
                            : stepNum < step
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        Основные данные
                      </h3>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Имя пользователя</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Введите имя пользователя"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Пароль</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Создайте пароль"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Подтвердите пароль</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10 pr-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        Контрольные вопросы
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        Ответьте на 3 вопроса для восстановления пароля
                      </p>

                      {[0, 1, 2].map((index) => (
                        <div key={index} className="space-y-2">
                          <select
                            value={formData.selectedQuestions[index]}
                            onChange={(e) => handleQuestionChange(index, parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                          >
                            {securityQuestions.map((question, qIndex) => (
                              <option key={qIndex} value={qIndex}>
                                {question}
                              </option>
                            ))}
                          </select>
                          <Input
                            type="text"
                            placeholder="Ваш ответ"
                            value={formData.securityAnswers[index]}
                            onChange={(e) => handleSecurityAnswer(index, e.target.value)}
                            className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        Дополнительная защита
                      </h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          PIN-код (4-6 цифр) - необязательно
                        </label>
                        <Input
                          type="number"
                          placeholder="Создайте PIN-код"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange("pinCode", e.target.value)}
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          maxLength={6}
                        />
                      </div>

                      {formData.pinCode && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Подтвердите PIN-код</label>
                          <Input
                            type="number"
                            placeholder="Повторите PIN-код"
                            value={formData.confirmPinCode}
                            onChange={(e) => handleInputChange("confirmPinCode", e.target.value)}
                            className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            maxLength={6}
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Checkbox
                          checked={useFingerprint}
                          onCheckedChange={setUseFingerprint}
                        />
                        <span className="text-sm text-gray-600">Включить вход по отпечатку пальца</span>
                      </div>

                      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                        💡 PIN-код можно изменить или отключить в настройках. Без PIN-кода вход будет менее защищен.
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-center text-gray-800">
                        Завершение регистрации
                      </h3>

                      {/* Google reCAPTCHA */}
                      <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Checkbox
                          checked={captchaVerified}
                          onCheckedChange={setCaptchaVerified}
                        />
                        <span className="text-sm text-gray-600">Я не робот</span>
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                            rC
                          </div>
                        </div>
                      </div>

                      {/* Terms Agreement */}
                      <div className="flex items-start space-x-2 p-3 border border-gray-200 rounded-lg">
                        <Checkbox
                          checked={agreedToTerms}
                          onCheckedChange={setAgreedToTerms}
                        />
                        <div className="text-sm text-gray-600">
                          Я согласен(а) с{" "}
                          <button 
                            type="button"
                            onClick={() => setShowUserAgreement(true)}
                            className="text-purple-600 hover:text-purple-700 underline"
                          >
                            Пользовательским соглашением ABEBA BANK
                          </button>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-green-600 font-semibold">🎉 Бонус за регистрацию!</div>
                        <div className="text-sm text-green-700">
                          +10$ на баланс + 5 ABEBA токенов
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    {step > 1 && (
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад
                      </Button>
                    )}

                    <div className="ml-auto">
                      {step < 4 ? (
                        <Button
                          onClick={nextStep}
                          disabled={
                            (step === 1 && (!formData.username || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword)) ||
                            (step === 2 && formData.securityAnswers.some(answer => !answer.trim())) ||
                            (step === 3 && formData.pinCode && formData.pinCode !== formData.confirmPinCode)
                          }
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          Далее
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRegister}
                          disabled={!captchaVerified || !agreedToTerms || loading}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Создать аккаунт
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 space-y-2"
        >
          <p className="text-sm text-gray-600">Нужна помощь?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:abeba_bank@mail.ru" className="text-purple-600 hover:text-purple-700">
              📧 abeba_bank@mail.ru
            </a>
            <a href="https://t.me/Abeba_official" className="text-purple-600 hover:text-purple-700">
              💬 t.me/Abeba_official
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* User Agreement Modal */}
      <UserAgreementModal
        isOpen={showUserAgreement}
        onClose={() => setShowUserAgreement(false)}
      />
    </div>
  )
}