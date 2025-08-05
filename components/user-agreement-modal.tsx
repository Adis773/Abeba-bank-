"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, FileText, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

interface UserAgreementModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
  showAcceptButton?: boolean
}

export function UserAgreementModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  showAcceptButton = false 
}: UserAgreementModalProps) {
  const [hasRead, setHasRead] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleAccept = () => {
    if (onAccept) onAccept()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Пользовательское соглашение
                  </h2>
                  <p className="text-sm text-gray-600">ABEBA BANK</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="h-[60vh] p-6">
              <div className="prose prose-sm max-w-none space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <strong>Важно:</strong> Внимательно прочитайте данное соглашение перед использованием платформы ABEBA BANK.
                  </div>
                </div>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    1. Общие положения
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Настоящее Пользовательское соглашение (далее — "Соглашение") регулирует условия доступа и использования платформы Abeba Bank (далее — "Платформа") пользователями (далее — "Пользователь"), а также правила обработки персональных, транзакционных, биометрических и иных данных, передаваемых или формируемых в процессе использования Платформы.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>1.1.</strong> Настоящее Соглашение является публичной офертой и признается надлежащим образом акцептованным с момента начала использования Платформы.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>1.2.</strong> Использование Платформы допускается только в случае полного согласия Пользователя с положениями настоящего Соглашения без каких-либо оговорок, исключений или дополнений.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    2. Условия регистрации и идентификации
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>2.1.</strong> Регистрация осуществляется через предоставление псевдоидентификационных данных, не исключающих возможность обратной корреляции.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>2.2.</strong> Платформа вправе применять многофакторные методы верификации, включая, но не ограничиваясь, биометрией, поведенческим анализом и контекстуальной логикой.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>2.3.</strong> Платформа оставляет за собой право приостановить или заблокировать доступ к сервису без объяснения причин.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    3. Условия взаимодействия и обязательства
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>3.1.</strong> Все функции, инструменты и интерфейсы предоставляются "как есть" (as-is) и "в зависимости от наличия" (as-available).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>3.2.</strong> Пользователь признает, что любые виртуальные активы, бонусы и начисления, отображаемые в рамках Платформы, не подлежат обязательному правовому признанию как фиатные средства.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>3.3.</strong> Все расчетные операции в рамках Платформы являются условными и не порождают фидуциарных обязательств между Сторонами.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    4. Возврат, рекламации и обязательства
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>4.1.</strong> Возврат денежных средств, бонусов, цифровых активов или иных ценностей, зачисленных через Платформу, не осуществляется ни при каких условиях, за исключением явно установленного процессуального решения надлежащего органа.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>4.2.</strong> Заявления Пользователей относительно потерь, сбоев, некорректных операций или ошибок, обрабатываются только в соответствии с внутренним алгоритмом Платформы и не подлежат пересмотру третьими сторонами.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    5. Конфиденциальность и обработка данных
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🛡️ Швейцарская защита данных</h4>
                    <p className="text-blue-700 text-sm">
                      Ваши данные защищены по стандартам швейцарской банковской тайны. Мы никогда не передадим вашу информацию третьим лицам.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>5.1.</strong> Платформа обрабатывает данные Пользователя исключительно в рамках исполнения функционала и в соответствии с псевдоанонимными принципами.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>5.2.</strong> Платформа может агрегировать, анализировать, а также деанонимизировать данные в целях улучшения алгоритмов, защиты от мошенничества, коммерческого моделирования и маркетинговых решений.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>5.3.</strong> Данные не передаются третьим лицам, за исключением случаев, предусмотренных процедурой защиты самой Платформы, её инфраструктуры или в рамках соблюдения требований регулирующих инстанций, не подлежащих публичному раскрытию.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    6. Безопасность и ограничение ответственности
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>6.1.</strong> Платформа не несет ответственности за действия третьих лиц, утерю доступа, компрометацию учетных данных, непреднамеренную передачу средств и иные действия, не контролируемые напрямую алгоритмами Платформы.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>6.2.</strong> Пользователь обязан обеспечить сохранность своих идентификационных реквизитов, паролей, кодов подтверждения и других данных, необходимых для аутентификации.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>6.3.</strong> Все действия, совершенные с использованием учетной записи Пользователя, считаются совершенными лично Пользователем.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    7. Юрисдикция и применимое право
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>7.1.</strong> К правовым отношениям, возникающим в рамках использования Платформы, применяется право, определяемое исключительно юрисдикцией хостинга ядра платформенной логики.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>7.2.</strong> Все споры и разногласия подлежат разрешению в порядке закрытого внутреннего разбирательства Платформы, решения которого являются окончательными и не подлежат апелляции.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    8. Заключительные положения
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-purple-800 mb-2">💰 Наши преимущества</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Нулевые комиссии на все операции</li>
                      <li>• Огромные бонусы до 5% с покупок</li>
                      <li>• Бонус +10$ за регистрацию</li>
                      <li>• Швейцарская защита данных</li>
                      <li>• Мгновенные переводы 24/7</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>8.1.</strong> Платформа оставляет за собой право в одностороннем порядке изменять условия настоящего Соглашения без предварительного уведомления.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>8.2.</strong> Продолжение использования Платформы после внесения изменений означает согласие Пользователя с такими изменениями.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>8.3.</strong> В случае расхождения версий перевода Соглашения, приоритет имеет версия, размещённая на домене основного интерфейса Платформы.
                  </p>
                </section>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Контакты для связи</h4>
                  </div>
                  <div className="text-green-700 text-sm space-y-1">
                    <p>📧 Email: abeba_bank@mail.ru</p>
                    <p>💬 Telegram: t.me/Abeba_official</p>
                    <p>🌐 Сайт: abebabank.vercel.app</p>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
                  <p>© 2024 ABEBA BANK. Все права защищены.</p>
                  <p>Дата последнего обновления: 20 января 2024 г.</p>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            {showAcceptButton && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3 mb-4">
                  <Checkbox
                    checked={hasRead}
                    onCheckedChange={setHasRead}
                  />
                  <span className="text-sm text-gray-700">
                    Я полностью прочитал(а) и понимаю условия соглашения
                  </span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <Checkbox
                    checked={agreed}
                    onCheckedChange={setAgreed}
                    disabled={!hasRead}
                  />
                  <span className="text-sm text-gray-700">
                    Я согласен(а) с условиями пользовательского соглашения ABEBA BANK
                  </span>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleAccept}
                    disabled={!hasRead || !agreed}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Принять и продолжить
                  </Button>
                </div>
              </div>
            )}

            {!showAcceptButton && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Закрыть
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}