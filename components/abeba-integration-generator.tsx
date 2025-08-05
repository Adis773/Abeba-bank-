"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Code, Monitor, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { abebaCardSystem } from "@/lib/abeba-card-system"

interface AbebaIntegrationGeneratorProps {
  user: any
}

export function AbebaIntegrationGenerator({ user }: AbebaIntegrationGeneratorProps) {
  const [merchantId, setMerchantId] = useState(`merchant_${user?.id || 'demo'}`)
  const [amount, setAmount] = useState('100')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('Покупка товара')
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tabName)
    toast.success(`${tabName} код скопирован!`)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const generateIframeCode = () => {
    return abebaCardSystem.generatePaymentIframe(merchantId, parseFloat(amount), currency, description)
  }

  const generateJavaScriptCode = () => {
    return abebaCardSystem.generatePaymentJS(merchantId)
  }

  const generateHTMLExample = () => {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABEBA Payment Integration</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .abeba-payment-container {
            margin: 30px 0;
            text-align: center;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .product {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .price {
            font-size: 24px;
            font-weight: bold;
            color: #6b46c1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛍️ Интернет-магазин с ABEBA Payment</h1>
        
        <div class="product">
            <div>
                <h3>Смартфон iPhone 15 Pro</h3>
                <p>Новейший флагманский смартфон Apple</p>
            </div>
            <div class="price">${amount} ${currency}</div>
        </div>

        <div class="abeba-payment-container">
            <h3>💳 Оплата через ABEBA</h3>
            <p>Безопасная оплата ABEBA-картой с нулевой комиссией</p>
            
            <!-- ABEBA Payment Iframe -->
            ${generateIframeCode()}
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
            <h4>✨ Преимущества ABEBA Payment:</h4>
            <ul>
                <li>🚀 Мгновенные переводы 24/7</li>
                <li>💰 Нулевые комиссии для покупателей</li>
                <li>🛡️ Швейцарские стандарты безопасности</li>
                <li>🎁 Бонусы до 5% с каждой покупки</li>
                <li>📱 Удобный мобильный интерфейс</li>
            </ul>
        </div>
    </div>

    <script>
        // Обработка сообщений от ABEBA Payment
        window.addEventListener('message', function(event) {
            if (event.data.type === 'ABEBA_PAYMENT_SUCCESS') {
                alert('🎉 Платеж успешно проведен!\\n' + 
                      'ID транзакции: ' + event.data.transactionId + '\\n' +
                      'Сумма: ' + event.data.amount + ' ' + event.data.currency);
                
                // Здесь можно добавить логику после успешной оплаты
                // Например, редирект на страницу благодарности
                // window.location.href = '/thank-you';
            }
        });
    </script>
</body>
</html>`
  }

  const generateReactExample = () => {
    return `import React, { useEffect } from 'react';

const AbebaPaymentComponent = () => {
  useEffect(() => {
    // Обработка сообщений от ABEBA Payment
    const handleMessage = (event) => {
      if (event.data.type === 'ABEBA_PAYMENT_SUCCESS') {
        console.log('Payment successful:', event.data);
        // Обработка успешной оплаты
        onPaymentSuccess(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const onPaymentSuccess = (paymentData) => {
    // Ваша логика после успешной оплаты
    alert(\`Платеж на сумму \${paymentData.amount} \${paymentData.currency} успешно проведен!\`);
  };

  return (
    <div className="abeba-payment-container">
      <h3>💳 Оплата через ABEBA</h3>
      <p>Безопасная оплата ABEBA-картой</p>
      
      {/* ABEBA Payment Iframe */}
      <iframe 
        src="https://abebabank.vercel.app/pay?merchant=${merchantId}&amount=${amount}&currency=${currency}&description=${encodeURIComponent(description)}" 
        width="400" 
        height="600" 
        frameBorder="0" 
        style={{
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
};

export default AbebaPaymentComponent;`
  }

  const generateAPIExample = () => {
    return `// Пример серверной интеграации с ABEBA Payment API

// Node.js / Express пример
app.post('/process-abeba-payment', async (req, res) => {
  try {
    const {
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      amount,
      currency = 'USD'
    } = req.body;

    // Отправка запроса к ABEBA Payment API
    const response = await fetch('https://abebabank.vercel.app/api/abeba-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
        amount,
        currency,
        merchantId: '${merchantId}',
        description: '${description}'
      })
    });

    const result = await response.json();

    if (result.success) {
      // Платеж успешен
      console.log('Payment successful:', result.transactionId);
      
      // Сохранение транзакции в базе данных
      await saveTransaction({
        transactionId: result.transactionId,
        amount,
        currency,
        status: 'completed',
        createdAt: new Date()
      });

      res.json({
        success: true,
        transactionId: result.transactionId,
        message: 'Платеж успешно проведен'
      });
    } else {
      // Ошибка платежа
      console.error('Payment failed:', result.message);
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Проверка валидности ABEBA-карты
app.get('/validate-abeba-card/:cardNumber', async (req, res) => {
  try {
    const { cardNumber } = req.params;
    
    const response = await fetch(
      \`https://abebabank.vercel.app/api/abeba-payment?action=validate&cardNumber=\${cardNumber}\`
    );
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка валидации' });
  }
});`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-purple-600" />
            <span>ABEBA Payment Integration</span>
          </CardTitle>
          <p className="text-gray-600">
            Интегрируйте ABEBA-платежи в свой сайт за несколько минут
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Merchant ID</label>
              <Input
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="merchant_12345"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Сумма</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Валюта</label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Описание</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Покупка товара"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="iframe" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="iframe">Iframe</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="iframe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                                 <span className="flex items-center space-x-2">
                   <Monitor className="w-5 h-5" />
                   <span>Iframe интеграция</span>
                 </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateIframeCode(), 'Iframe')}
                  className="flex items-center space-x-2"
                >
                  {copiedTab === 'Iframe' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Копировать</span>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Самый простой способ - вставьте этот код в ваш HTML
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateIframeCode()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="javascript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>JavaScript SDK</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateJavaScriptCode(), 'JavaScript')}
                  className="flex items-center space-x-2"
                >
                  {copiedTab === 'JavaScript' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Копировать</span>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Полнофункциональный JavaScript SDK для динамических форм
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                <code>{generateJavaScriptCode()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Полный HTML пример</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateHTMLExample(), 'HTML')}
                  className="flex items-center space-x-2"
                >
                  {copiedTab === 'HTML' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Копировать</span>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Готовая HTML страница с интегрированной ABEBA оплатой
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                <code>{generateHTMLExample()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>React компонент</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateReactExample(), 'React')}
                  className="flex items-center space-x-2"
                >
                  {copiedTab === 'React' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Копировать</span>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                React компонент для интеграции в современные веб-приложения
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-cyan-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                <code>{generateReactExample()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Server API интеграция</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateAPIExample(), 'API')}
                  className="flex items-center space-x-2"
                >
                  {copiedTab === 'API' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>Копировать</span>
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Серверная интеграция для обработки платежей через API
              </p>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-purple-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                <code>{generateAPIExample()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Предварительный просмотр</CardTitle>
          <p className="text-sm text-gray-600">
            Так будет выглядеть форма оплаты на вашем сайте
          </p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <iframe 
              src={`/pay?merchant=${merchantId}&amount=${amount}&currency=${currency}&description=${encodeURIComponent(description)}`}
              width="400" 
              height="600" 
              className="border-0 rounded-lg shadow-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}