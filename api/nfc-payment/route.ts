import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, recipient, nfcData, cardId } = await request.json()

    console.log(`[ДЕМО-NFC] Обработка NFC платежа: ${amount} ABEBA для ${recipient}`)
    console.log(`[ДЕМО-NFC] NFC Card ID: ${cardId}`)

    // --- ДЕМО-РЕЖИМ: Всегда считаем карту валидной и баланс достаточным ---
    const isValidCard = true // await validateNFCCard(cardId);
    const cardBalance = amount + 100 // await getNFCCardBalance(cardId); // Всегда достаточно средств

    if (!isValidCard) {
      return NextResponse.json(
        {
          success: false,
          error: "Недействительная NFC карта (ДЕМО)",
        },
        { status: 400 },
      )
    }

    if (cardBalance < amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Недостаточно средств на NFC карте (ДЕМО)",
        },
        { status: 400 },
      )
    }

    // Имитация обработки NFC платежа
    const txHash = await processNFCTransaction(cardId, recipient, amount)

    // Имитация обновления баланса карты
    // await updateNFCCardBalance(cardId, cardBalance - amount);

    return NextResponse.json({
      success: true,
      txHash,
      cardId,
      newBalance: cardBalance - amount,
      message: "NFC платеж успешно обработан (ДЕМО)",
    })
  } catch (error) {
    console.error("Ошибка NFC платежа (ДЕМО):", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обработки NFC платежа (ДЕМО)",
      },
      { status: 500 },
    )
  }
}

// ДЕМО-функции для имитации NFC
async function validateNFCCard(cardId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return cardId.startsWith("abeba_")
}

async function getNFCCardBalance(cardId: string): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return Math.random() * 1000 + 100 // Случайный баланс для демо
}

async function processNFCTransaction(cardId: string, recipient: string, amount: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return `0x${Math.random().toString(16).substr(2, 64)}`
}

async function updateNFCCardBalance(cardId: string, newBalance: number): Promise<void> {
  console.log(`[ДЕМО-NFC] Обновлен баланс NFC карты ${cardId} до ${newBalance}`)
  await new Promise((resolve) => setTimeout(resolve, 100))
}
