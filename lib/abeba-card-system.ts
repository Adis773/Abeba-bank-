export interface AbebaCard {
  id: string
  userId: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  balance: number
  isActive: boolean
  createdAt: Date
  lastUsed?: Date
}

export interface PaymentRequest {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  amount: number
  currency: string
  merchantId: string
  description: string
  returnUrl?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  message: string
}

export class AbebaCardSystem {
  private static instance: AbebaCardSystem
  private cards: Map<string, AbebaCard> = new Map()
  private transactions: Map<string, any> = new Map()

  static getInstance(): AbebaCardSystem {
    if (!AbebaCardSystem.instance) {
      AbebaCardSystem.instance = new AbebaCardSystem()
    }
    return AbebaCardSystem.instance
  }

  // Генерация номера ABEBA-карты
  generateCardNumber(): string {
    // ABEBA карты начинаются с 4444 (как отличительный признак)
    const prefix = "4444"
    const middle = Math.floor(1000 + Math.random() * 9000).toString()
    const suffix = Math.floor(1000 + Math.random() * 9000).toString()
    const last = Math.floor(1000 + Math.random() * 9000).toString()
    
    return `${prefix} ${middle} ${suffix} ${last}`
  }

  // Генерация CVV
  generateCVV(): string {
    return Math.floor(100 + Math.random() * 900).toString()
  }

  // Генерация срока действия (5 лет от текущей даты)
  generateExpiryDate(): string {
    const now = new Date()
    const expiryYear = now.getFullYear() + 5
    const expiryMonth = String(now.getMonth() + 1).padStart(2, '0')
    return `${expiryMonth}/${expiryYear.toString().slice(-2)}`
  }

  // Создание новой ABEBA-карты
  createCard(userId: string, cardHolder: string): AbebaCard {
    const card: AbebaCard = {
      id: `abeba_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      cardNumber: this.generateCardNumber(),
      cardHolder: cardHolder.toUpperCase(),
      expiryDate: this.generateExpiryDate(),
      cvv: this.generateCVV(),
      balance: 0,
      isActive: true,
      createdAt: new Date()
    }

    this.cards.set(card.cardNumber.replace(/\s/g, ''), card)
    return card
  }

  // Валидация номера карты
  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '')
    
    // Проверяем, что это ABEBA карта (начинается с 4444)
    if (!cleaned.startsWith('4444')) {
      return false
    }

    // Проверяем длину (16 цифр)
    if (cleaned.length !== 16) {
      return false
    }

    // Простая проверка Luhn алгоритма для ABEBA карт
    return this.luhnCheck(cleaned)
  }

  // Алгоритм Луна для проверки номера карты
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Валидация CVV
  validateCVV(cvv: string): boolean {
    return /^\d{3}$/.test(cvv)
  }

  // Валидация срока действия
  validateExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return false

    const month = parseInt(match[1])
    const year = parseInt(`20${match[2]}`)
    
    if (month < 1 || month > 12) return false

    const now = new Date()
    const expiry = new Date(year, month - 1)
    
    return expiry > now
  }

  // Получение карты по номеру
  getCard(cardNumber: string): AbebaCard | null {
    const cleaned = cardNumber.replace(/\s/g, '')
    return this.cards.get(cleaned) || null
  }

  // Обработка платежа
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Валидация данных карты
      if (!this.validateCardNumber(request.cardNumber)) {
        return {
          success: false,
          error: 'INVALID_CARD_NUMBER',
          message: 'Неверный номер ABEBA-карты'
        }
      }

      if (!this.validateCVV(request.cvv)) {
        return {
          success: false,
          error: 'INVALID_CVV',
          message: 'Неверный CVV код'
        }
      }

      if (!this.validateExpiryDate(request.expiryDate)) {
        return {
          success: false,
          error: 'INVALID_EXPIRY',
          message: 'Неверный срок действия карты'
        }
      }

      // Получение карты
      const card = this.getCard(request.cardNumber)
      if (!card) {
        return {
          success: false,
          error: 'CARD_NOT_FOUND',
          message: 'ABEBA-карта не найдена'
        }
      }

      if (!card.isActive) {
        return {
          success: false,
          error: 'CARD_INACTIVE',
          message: 'ABEBA-карта заблокирована'
        }
      }

      // Проверка данных карты
      if (card.cardHolder !== request.cardHolder.toUpperCase()) {
        return {
          success: false,
          error: 'INVALID_CARDHOLDER',
          message: 'Неверное имя держателя карты'
        }
      }

      if (card.cvv !== request.cvv) {
        return {
          success: false,
          error: 'INVALID_CVV',
          message: 'Неверный CVV код'
        }
      }

      if (card.expiryDate !== request.expiryDate) {
        return {
          success: false,
          error: 'INVALID_EXPIRY',
          message: 'Неверный срок действия'
        }
      }

      // Проверка баланса
      if (card.balance < request.amount) {
        return {
          success: false,
          error: 'INSUFFICIENT_FUNDS',
          message: 'Недостаточно средств на ABEBA-карте'
        }
      }

      // Проведение транзакции
      const transactionId = `abeba_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Списание средств
      card.balance -= request.amount
      card.lastUsed = new Date()

      // Сохранение транзакции
      const transaction = {
        id: transactionId,
        cardId: card.id,
        amount: request.amount,
        currency: request.currency,
        merchantId: request.merchantId,
        description: request.description,
        status: 'completed',
        createdAt: new Date()
      }

      this.transactions.set(transactionId, transaction)

      return {
        success: true,
        transactionId,
        message: 'Платеж успешно проведен через ABEBA-карту'
      }

    } catch (error) {
      return {
        success: false,
        error: 'PROCESSING_ERROR',
        message: 'Ошибка при обработке платежа'
      }
    }
  }

  // Пополнение баланса карты
  addBalance(cardNumber: string, amount: number): boolean {
    const card = this.getCard(cardNumber)
    if (card && card.isActive) {
      card.balance += amount
      return true
    }
    return false
  }

  // Получение баланса карты
  getBalance(cardNumber: string): number {
    const card = this.getCard(cardNumber)
    return card ? card.balance : 0
  }

  // Блокировка/разблокировка карты
  setCardStatus(cardNumber: string, isActive: boolean): boolean {
    const card = this.getCard(cardNumber)
    if (card) {
      card.isActive = isActive
      return true
    }
    return false
  }

  // Получение истории транзакций
  getTransactionHistory(cardNumber: string): any[] {
    const card = this.getCard(cardNumber)
    if (!card) return []

    return Array.from(this.transactions.values())
      .filter(tx => tx.cardId === card.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Генерация iframe кода для интеграции
  generatePaymentIframe(merchantId: string, amount: number, currency: string = 'USD', description: string = ''): string {
    const baseUrl = 'https://abebabank.vercel.app'
    const params = new URLSearchParams({
      merchant: merchantId,
      amount: amount.toString(),
      currency,
      description
    })

    return `<iframe 
      src="${baseUrl}/pay?${params.toString()}" 
      width="400" 
      height="600" 
      frameborder="0" 
      style="border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    </iframe>`
  }

  // Генерация JavaScript кода для интеграции
  generatePaymentJS(merchantId: string): string {
    return `
// ABEBA Payment Integration
class AbebaPayment {
  constructor(merchantId) {
    this.merchantId = merchantId;
    this.baseUrl = 'https://abebabank.vercel.app';
  }

  // Создание формы оплаты
  createPaymentForm(amount, currency = 'USD', description = '') {
    const form = document.createElement('div');
    form.innerHTML = \`
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; font-family: system-ui;">
        <h3 style="text-align: center; color: #6b46c1;">💳 Оплата ABEBA-картой</h3>
        <form id="abeba-payment-form">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Номер карты</label>
            <input type="text" name="cardNumber" placeholder="4444 1111 2222 3333" 
                   style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;" 
                   maxlength="19" required>
          </div>
          <div style="display: flex; gap: 15px;">
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">Срок</label>
              <input type="text" name="expiry" placeholder="MM/YY" 
                     style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;" 
                     maxlength="5" required>
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">CVV</label>
              <input type="text" name="cvv" placeholder="123" 
                     style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;" 
                     maxlength="3" required>
            </div>
          </div>
          <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Имя держателя</label>
            <input type="text" name="cardHolder" placeholder="ABEBA USER" 
                   style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;" required>
          </div>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <div style="display: flex; justify-content: between; margin-bottom: 5px;">
              <span>Сумма:</span>
              <strong>\${amount} \${currency}</strong>
            </div>
            <div style="font-size: 14px; color: #6b7280;">\${description}</div>
          </div>
          <button type="submit" 
                  style="width: 100%; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">
            💳 Оплатить \${amount} \${currency}
          </button>
        </form>
      </div>
    \`;
    return form;
  }

  // Инициализация платежа
  async processPayment(formData) {
    try {
      const response = await fetch(\`\${this.baseUrl}/api/abeba-payment\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          merchantId: this.merchantId
        })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'NETWORK_ERROR', message: 'Ошибка сети' };
    }
  }
}

// Использование:
// const abeba = new AbebaPayment('${merchantId}');
// const form = abeba.createPaymentForm(100, 'USD', 'Покупка товара');
// document.body.appendChild(form);
`
  }
}

// Экспорт синглтона
export const abebaCardSystem = AbebaCardSystem.getInstance()