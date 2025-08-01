import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, userId } = await request.json()

    console.log(`[API] Имитация покупки ABEBA: ${amount} через ${paymentMethod} для пользователя ${userId}`)

    // Имитация задержки обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // В реальном приложении здесь была бы интеграция с платежным шлюзом (например, Stripe)
    // и логика взаимодействия с блокчейном для фактической покупки токенов.
    // Поскольку это демо, мы просто имитируем успех.

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}` // Имитация хеша транзакции

    return NextResponse.json({
      success: true,
      message: "ABEBA успешно куплены (ДЕМО-режим).",
      txHash: txHash,
    })
  } catch (error) {
    console.error("Ошибка при имитации покупки ABEBA:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось имитировать покупку ABEBA.",
      },
      { status: 500 },
    )
  }
}
