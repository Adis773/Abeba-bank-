import { NextRequest, NextResponse } from 'next/server'
import { abebaCardSystem } from '@/lib/abeba-card-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      amount,
      currency = 'USD',
      merchantId,
      description = '',
      returnUrl
    } = body

    // Валидация обязательных полей
    if (!cardNumber || !cardHolder || !expiryDate || !cvv || !amount || !merchantId) {
      return NextResponse.json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Заполните все обязательные поля'
      }, { status: 400 })
    }

    // Валидация суммы
    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_AMOUNT',
        message: 'Сумма должна быть больше нуля'
      }, { status: 400 })
    }

    // Обработка платежа через систему ABEBA-карт
    const paymentResult = await abebaCardSystem.processPayment({
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      amount: parseFloat(amount),
      currency,
      merchantId,
      description,
      returnUrl
    })

    // Возвращаем результат с соответствующим статусом
    const statusCode = paymentResult.success ? 200 : 400
    
    return NextResponse.json(paymentResult, { status: statusCode })

  } catch (error) {
    console.error('ABEBA Payment API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'validate') {
    const cardNumber = searchParams.get('cardNumber')
    
    if (!cardNumber) {
      return NextResponse.json({
        success: false,
        error: 'MISSING_CARD_NUMBER',
        message: 'Номер карты не указан'
      }, { status: 400 })
    }

    const isValid = abebaCardSystem.validateCardNumber(cardNumber)
    
    return NextResponse.json({
      success: true,
      valid: isValid,
      message: isValid ? 'Номер ABEBA-карты действителен' : 'Неверный номер ABEBA-карты'
    })
  }

  if (action === 'balance') {
    const cardNumber = searchParams.get('cardNumber')
    
    if (!cardNumber) {
      return NextResponse.json({
        success: false,
        error: 'MISSING_CARD_NUMBER',
        message: 'Номер карты не указан'
      }, { status: 400 })
    }

    const balance = abebaCardSystem.getBalance(cardNumber)
    
    return NextResponse.json({
      success: true,
      balance,
      message: `Баланс ABEBA-карты: $${balance.toFixed(2)}`
    })
  }

  return NextResponse.json({
    success: false,
    error: 'INVALID_ACTION',
    message: 'Неверное действие'
  }, { status: 400 })
}