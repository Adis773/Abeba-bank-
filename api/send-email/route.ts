import { Resend } from "resend"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set.")
      return NextResponse.json({ error: "Server configuration error: Resend API key not set." }, { status: 500 })
    }

    if (!RESEND_SENDER_EMAIL) {
      console.error("RESEND_SENDER_EMAIL environment variable is not set.")
      return NextResponse.json({ error: "Server configuration error: Sender email not set." }, { status: 500 })
    }

    // Инициализируем Resend с API ключом из переменных окружения
    const resend = new Resend(RESEND_API_KEY)

    // Отправляем email
    const { data, error } = await resend.emails.send({
      from: `ABEBA Bank <${RESEND_SENDER_EMAIL}>`, // Используем переменную окружения для отправителя
      to: [email],
      subject: "Ваш код подтверждения ABEBA Bank",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #ff6600;">Добро пожаловать в ABEBA Bank!</h2>
          <p>Ваш код подтверждения: <strong>${code}</strong></p>
          <p>Используйте этот код для завершения регистрации или входа в систему.</p>
          <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.</p>
          <p>С уважением,<br/>Команда ABEBA Bank</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend email error:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
