import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // В реальном приложении здесь будет запрос к блокчейну
    // для получения истории транзакций

    console.log(`Fetching transactions for ${address}`)

    // Имитация запроса истории
    await new Promise((resolve) => setTimeout(resolve, 800))

    const transactions = [
      {
        id: 1,
        type: "receive",
        amount: 150.0,
        from: "@memefriend",
        description: "За шавуху 🥙",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "completed",
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
      {
        id: 2,
        type: "send",
        amount: 75.5,
        to: "@coffeeshop",
        description: "Кофе американо ☕",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "completed",
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
    ]

    return NextResponse.json({
      success: true,
      transactions,
      address,
    })
  } catch (error) {
    console.error("Transaction history fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transaction history",
      },
      { status: 500 },
    )
  }
}
