"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, QrCode, Send, ArrowDownToLine, Store, TrendingUp, Settings, LogOut, Copy, Eye, EyeOff, Plus, Wifi } from 'lucide-react'
import Image from "next/image"
import { RealBuyAbebaModal } from "@/components/real-buy-abeba-modal"
import { SendMoneyModal } from "@/components/send-money-modal"
import { ReceiveMoneyModal } from "@/components/receive-money-modal"
import { RealQRScanner } from "@/components/real-qr-scanner"
import { RealNFCPayment } from "@/components/real-nfc-payment"
import { BusinessDashboard } from "@/components/business-dashboard"
import { Analytics } from "@/components/analytics" // Импортируем компонент аналитики
import { BlockchainService } from "@/lib/blockchain-service"

interface MainAppProps {
  user: any
  onLogout: () => void
}

const TOKEN_MINT = "21CcDkerURgWdE7YfCLfhas7TdVXnpE22kjAAMEzpump"
const WEBSOCKET_URL = "wss://pumpportal.fun/ws"

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("wallet")
  const [balance, setBalance] = useState(0)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showNFCModal, setShowNFCModal] = useState(false)
  const [abebaPrice, setAbebaPrice] = useState(0.0) // Начальная цена, будет обновляться WebSocket
  const [transactions, setTransactions] = useState<any[]>([])

  const blockchainService = BlockchainService.getInstance()

  // Загружаем баланс пользователя и настраиваем WebSocket для цены ABEBA
  useEffect(() => {
    const fetchInitialData = async () => {
      const savedBalance = localStorage.getItem(`abeba_balance_${user.id}`)
      if (savedBalance) {
        setBalance(Number.parseFloat(savedBalance))
      } else {
        const fetchedBalance = await blockchainService.getBalance(user.walletAddress)
        updateBalance(fetchedBalance)
      }
      const fetchedTransactions = await blockchainService.getTransactionHistory(user.walletAddress)
      setTransactions(fetchedTransactions)
    }

    fetchInitialData()

    // WebSocket для живой цены
    const socket = new WebSocket(WEBSOCKET_URL)

    socket.onopen = () => {
      console.log("WebSocket connected. Subscribing to token trade updates.")
      socket.send(
        JSON.stringify({
          method: "subscribeTokenTrade",
          keys: [TOKEN_MINT],
        }),
      )
    }

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.method === "tokenTradeUpdate" && data.data?.price) {
        const price = Number.parseFloat(data.data.price)
        setAbebaPrice(price)
        // console.log(`New ABEBA price from WebSocket: ${price.toFixed(4)}`);
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason)
      // Опционально: можно реализовать логику переподключения здесь
    }

    // Обновляем баланс и транзакции каждые 30 секунд (без цены, т.к. она от WS)
    const interval = setInterval(async () => {
      const fetchedBalance = await blockchainService.getBalance(user.walletAddress)
      updateBalance(fetchedBalance)
      const fetchedTransactions = await blockchainService.getTransactionHistory(user.walletAddress)
      setTransactions(fetchedTransactions)
    }, 30000)

    return () => {
      socket.close() // Закрываем WebSocket при размонтировании компонента
      clearInterval(interval)
    }
  }, [user.id, user.walletAddress]) // Зависимости для useEffect

  // Сохраняем баланс
  const updateBalance = (newBalance: number) => {
    setBalance(newBalance)
    localStorage.setItem(`abeba_balance_${user.id}`, newBalance.toString())
  }

  const handleBuyAbeba = (amount: number, paymentMethod: string, txHash: string) => {
    const newBalance = balance + amount
    updateBalance(newBalance)

    const newTransaction = {
      id: Date.now(),
      type: "buy" as const,
      amount: amount,
      from: paymentMethod,
      description: `Покупка ABEBA через ${paymentMethod} 💳`,
      timestamp: new Date().toISOString(),
      status: "completed" as const,
      txHash: txHash,
    }

    setTransactions([newTransaction, ...transactions])
    setShowBuyModal(false)
  }

  const handleSendMoney = async (amount: number, recipient: string, description: string) => {
    if (balance >= amount) {
      const result = await blockchainService.sendAbeba(user.walletAddress, recipient, amount)

      if (result.success) {
        const newBalance = balance - amount
        updateBalance(newBalance)

        const newTransaction = {
          id: Date.now(),
          type: "send" as const,
          amount: amount,
          to: recipient,
          description: description,
          timestamp: new Date().toISOString(),
          status: "completed" as const,
          txHash: result.txHash,
        }

        setTransactions([newTransaction, ...transactions])
        setShowSendModal(false)
      } else {
        alert(`Ошибка отправки: ${result.error}`)
      }
    } else {
      alert("Недостаточно средств!")
    }
  }

  const handleQRScan = (scannedData: any) => {
    console.log("Scanned QR Data:", scannedData)
    setShowQRScanner(false)
    if (scannedData.paymentUrl) {
      setShowSendModal(true)
    }
  }

  const handleNFCPayment = (success: boolean, txHash?: string) => {
    if (success) {
      alert(`NFC оплата успешна! TxHash: ${txHash}`)
      blockchainService.getBalance(user.walletAddress).then(updateBalance)
      blockchainService.getTransactionHistory(user.walletAddress).then(setTransactions)
    } else {
      alert("NFC оплата не удалась.")
    }
    setShowNFCModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/abeba-logo.png" alt="ABEBA" width={40} height={40} className="rounded-full" />
              <div>
                <h1 className="text-xl font-bold text-white">ABEBA БАНК</h1>
                <p className="text-xs text-purple-300">Привет, {user.name}! 🦆</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-white whitespace-nowrap">
                    {balanceVisible ? `${balance.toFixed(2)}` : "••••••"} ABEBA
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-purple-300 hover:text-white"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="text-sm text-purple-300 whitespace-nowrap">≈ ${(balance * abebaPrice).toFixed(2)} USD</div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-purple-500/30 text-purple-300 bg-transparent hover:bg-purple-500/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600 whitespace-nowrap">
              <Wallet className="w-4 h-4 mr-2" />
              Кошелек
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-purple-600 whitespace-nowrap">
              <Store className="w-4 h-4 mr-2" />
              Бизнес
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 whitespace-nowrap">
              <TrendingUp className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 whitespace-nowrap">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => setShowBuyModal(true)}
                className="h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-col space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">Купить ABEBA</span>
              </Button>

              <Button
                onClick={() => setShowSendModal(true)}
                className="h-20 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 flex-col space-y-2"
              >
                <Send className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">Отправить</span>
              </Button>

              <Button
                onClick={() => setShowReceiveModal(true)}
                className="h-20 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 flex-col space-y-2"
              >
                <ArrowDownToLine className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">Получить</span>
              </Button>

              <Button
                onClick={() => setShowQRScanner(true)}
                className="h-20 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 flex-col space-y-2"
              >
                <QrCode className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">Сканировать QR</span>
              </Button>

              {/* New NFC Button */}
              <Button
                onClick={() => setShowNFCModal(true)}
                className="h-20 bg-gradient-to-br from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 flex-col space-y-2"
              >
                <Wifi className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">NFC Оплата</span>
              </Button>
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Основной баланс</h3>
                    <p className="text-yellow-200 text-sm">Твои абебные накопления 🦆</p>
                  </div>
                  <Image src="/abeba-logo.png" alt="ABEBA" width={60} height={60} className="opacity-80" />
                </div>

                <div className="space-y-2">
                  <div className="text-4xl font-bold text-white">{balance.toFixed(2)} ABEBA</div>
                  <div className="text-yellow-200">≈ ${(balance * abebaPrice).toFixed(2)} USD</div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500/20 text-green-400 whitespace-nowrap">Цена: ${abebaPrice.toFixed(4)}</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 whitespace-nowrap">+12.5% за день 📈</Badge>{" "}
                    {/* Это статика, можно убрать или обновить */}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-yellow-500/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-200">Адрес кошелька:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-yellow-100 bg-black/20 px-2 py-1 rounded text-xs">
                        {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(user.walletAddress)}
                        className="text-yellow-300 hover:text-yellow-100"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Последние операции</CardTitle>
                <CardDescription className="text-purple-300">Твоя абебная активность 🦆</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🦆</div>
                    <p className="text-purple-300">Пока операций нет</p>
                    <p className="text-sm text-purple-400">Купи ABEBA или получи первый перевод!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20 border border-purple-500/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "receive"
                                ? "bg-green-500/20 text-green-400"
                                : tx.type === "send"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {tx.type === "receive" ? "↓" : tx.type === "send" ? "↑" : "+"}
                          </div>
                          <div>
                            <div className="text-white font-medium">{tx.description}</div>
                            <div className="text-sm text-purple-300">
                              {tx.type === "receive"
                                ? `От ${tx.from}`
                                : tx.type === "send"
                                  ? `Для ${tx.to}`
                                  : `Через ${tx.from}`}
                            </div>
                            <div className="text-xs text-purple-400">
                              {new Date(tx.timestamp).toLocaleString("ru-RU")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${
                              tx.type === "receive" || tx.type === "buy" ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {tx.type === "receive" || tx.type === "buy" ? "+" : "-"}
                            {tx.amount.toFixed(2)} ABEBA
                          </div>
                          <Badge
                            className={`text-xs ${
                              tx.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {tx.status === "completed" ? "Завершено" : "В процессе"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ABEBA Token Info */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Image src="/abeba-logo.png" alt="ABEBA" width={24} height={24} className="mr-2" />О токене ABEBA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-purple-300">Текущая цена</div>
                    <div className="text-xl font-bold text-white">${abebaPrice.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300">Изменение за 24ч</div>
                    <div className="text-xl font-bold text-green-400">+12.5%</div>{" "}
                    {/* Это статика, можно убрать или обновить */}
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-sm text-purple-300 mb-1">Адрес контракта:</div>
                  <div className="flex items-center justify-between">
                    <code className="text-purple-100 text-xs">{TOKEN_MINT}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(TOKEN_MINT)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 bg-transparent whitespace-nowrap"
                  onClick={() => window.open(`https://pump.fun/${TOKEN_MINT}`, "_blank")}
                >
                  Посмотреть на Pump.fun 🚀
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <BusinessDashboard user={user} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics /> {/* Используем компонент Analytics */}
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Профиль</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Имя:</span>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Email:</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Статус:</span>
                    <Badge
                      className={
                        user.isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {user.isVerified ? "Верифицирован ✅" : "Не верифицирован"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Дата регистрации:</span>
                    <span className="text-white">{new Date(user.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Безопасность</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 whitespace-nowrap">Пройти верификацию 🛡️</Button>
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 bg-transparent whitespace-nowrap">
                    Изменить пароль
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 bg-transparent whitespace-nowrap">
                    Настройки уведомлений
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <RealBuyAbebaModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onBuy={handleBuyAbeba}
        currentPrice={abebaPrice}
      />

      <SendMoneyModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSend={handleSendMoney}
        currentBalance={balance}
      />

      <ReceiveMoneyModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} user={user} />

      <RealQRScanner isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} onScan={handleQRScan} />

      <RealNFCPayment
        isOpen={showNFCModal}
        onClose={() => setShowNFCModal(false)}
        amount={100}
        recipient={user.walletAddress}
        onPayment={handleNFCPayment}
      />
    </div>
  )
}
