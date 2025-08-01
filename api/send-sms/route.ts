import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    // --- ДЕМО-РЕЖИМ: Имитация отправки SMS ---
    // В реальном приложении здесь будет интеграция с SMS провайдером (например, Twilio)
    // const SMS_API_KEY = process.env.SMS_API_KEY; // Ваш реальный API ключ
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body: `Your ABEBA verification code is ${code}`, from: process.env.TWILIO_PHONE_NUMBER, to: phone });

    console.log(`[ДЕМО-SMS] Отправка SMS на ${phone}: Ваш код подтверждения ABEBA: ${code}`)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Имитация задержки

    return NextResponse.json({
      success: true,
      message: "SMS успешно отправлено (ДЕМО)",
    })
  } catch (error) {
    console.error("Ошибка отправки SMS (ДЕМО):", error)
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось отправить SMS (ДЕМО)",
      },
      { status: 500 },
    )
  }
}
