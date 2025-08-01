import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, recipient, originalAmount, originalRecipient } = await request.json()

    console.log(`[ДЕМО-NFC-URL] Обработка NFC URL платежа: ${amount} ABEBA для ${recipient}`)
    console.log(`[ДЕМО-NFC-URL] Оригинальные данные: ${originalAmount} ABEBA для ${originalRecipient}`)

    // --- ДЕМО-РЕЖИМ: Имитация обработки платежа по URL из NFC ---
    // В реальном приложении здесь будет логика обработки платежа,
    // полученного из URL, считанного с NFC тега.

    await new Promise((resolve) => setTimeout(resolve, 2000)) // Имитация задержки

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}` // Фиктивный хеш транзакции

    return NextResponse.json({
      success: true,
      txHash,
      amount,
      recipient,
      message: "Платеж по NFC URL успешно обработан (ДЕМО)",
    })
  } catch (error) {
    console.error("Ошибка обработки NFC URL платежа (ДЕМО):", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обработки NFC URL платежа (ДЕМО)",
      },
      { status: 500 },
    )
  }
}
