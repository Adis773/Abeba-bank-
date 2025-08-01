// Этот сервис теперь отвечает только за отправку email
export class SMSService {
  private static instance: SMSService

  static getInstance() {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService()
    }
    return SMSService.instance
  }

  /**
   * Отправляет код подтверждения на указанный email.
   * Использует серверный API /api/send-email для отправки через Resend.
   * @param email Адрес электронной почты получателя.
   * @param code Код подтверждения.
   * @returns Promise<boolean> true, если email отправлен успешно, false в противном случае.
   */
  async sendEmail(email: string, code: string): Promise<boolean> {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      if (response.ok) {
        console.log(`Email sent to ${email}`)
        return true
      }
      console.error("Failed to send email:", response.status, response.statusText)
      return false
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  /**
   * Генерирует 4-значный код подтверждения.
   * @returns string Сгенерированный код.
   */
  generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  /**
   * Проверяет, совпадает ли введенный код с фактическим.
   * @param inputCode Введенный пользователем код.
   * @param actualCode Фактический код, который был отправлен.
   * @returns boolean true, если коды совпадают, false в противном случае.
   */
  validateCode(inputCode: string, actualCode: string): boolean {
    return inputCode === actualCode
  }
}
