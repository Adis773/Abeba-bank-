import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { from, to, amount } = await request.json()

    // --- ДЕМО-РЕЖИМ: Имитация отправки ABEBA ---
    // В реальном приложении отправка токенов на блокчейне требует:
    // 1. Проверки баланса отправителя на блокчейне.
    // 2. Создания и подписания блокчейн-транзакции.
    // 3. Отправки транзакции в сеть.
    // Это сложная операция, которая обычно выполняется через кошелек пользователя
    // (например, MetaMask, Phantom) или специализированный бэкенд-сервис.

    console.log(`[ДЕМО-ОТПРАВКА] Имитация отправки ${amount} ABEBA с ${from} на ${to}`)

    await new Promise((resolve) => setTimeout(resolve, 1500)) // Имитация задержки

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}` // Фиктивный хеш транзакции

    return NextResponse.json({
      success: true,
      txHash,
      from,
      to,
      amount,
      message: "ABEBA успешно отправлены (ДЕМО). Для реальной отправки требуется интеграция с блокчейном.",
    })
  } catch (error) {
    console.error("Ошибка перевода ABEBA (ДЕМО):", error)
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось отправить ABEBA (ДЕМО)",
      },
      { status: 500 },
    )
  }
}
