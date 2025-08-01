"use server"

import { supabase } from "@/lib/supabase"

interface BusinessData {
  name: string
  description: string
  category: string
  email: string
  ownerId: string
  businessPhotoUrl?: string
}

// Серверное действие для регистрации нового бизнеса
export async function registerBusiness(data: BusinessData) {
  try {
    const { data: newBusiness, error } = await supabase
      .from("businesses")
      .insert([
        {
          name: data.name,
          description: data.description,
          category: data.category,
          email: data.email,
          owner_id: data.ownerId, // Используем owner_id для связи с пользователем
          business_photo_url: data.businessPhotoUrl,
        },
      ])
      .select() // Возвращаем вставленные данные
      .single()

    if (error) {
      console.error("Ошибка при регистрации бизнеса в Supabase:", error)
      return null
    }

    console.log("Бизнес успешно зарегистрирован:", newBusiness)
    return {
      id: newBusiness.id,
      name: newBusiness.name,
      description: newBusiness.description,
      category: newBusiness.category,
      email: newBusiness.email,
      ownerId: newBusiness.owner_id,
      businessPhotoUrl: newBusiness.business_photo_url,
    }
  } catch (e) {
    console.error("Непредвиденная ошибка в registerBusiness:", e)
    return null
  }
}

// Серверное действие для получения данных о бизнесе по ID пользователя
export async function getBusinessByUserId(userId: string) {
  try {
    const { data, error } = await supabase.from("businesses").select("*").eq("owner_id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 - "No rows found"
      console.error("Ошибка при получении бизнеса из Supabase:", error)
      return null
    }

    if (data) {
      console.log("Бизнес найден:", data)
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        email: data.email,
        ownerId: data.owner_id,
        businessPhotoUrl: data.business_photo_url,
      }
    }
    console.log("Бизнес для пользователя не найден.")
    return null
  } catch (e) {
    console.error("Непредвиденная ошибка в getBusinessByUserId:", e)
    return null
  }
}

// Серверное действие для получения транзакций бизнеса (имитация)
export async function getBusinessTransactions(businessId: string) {
  console.log(`[Server Action] Имитация получения транзакций для бизнеса ID: ${businessId}`)
  await new Promise((resolve) => setTimeout(resolve, 500)) // Имитация задержки

  // В реальном приложении здесь был бы запрос к базе данных или API для получения реальных транзакций
  return [
    { id: 1, customer: "@foodlover", amount: 125.0, item: "Шаурма + кола", time: "5 мин назад" },
    { id: 2, customer: "@student", amount: 45.5, item: "Кофе латте", time: "12 мин назад" },
    { id: 3, customer: "@memebro", amount: 200.0, item: "Комбо обед", time: "25 мин назад" },
  ]
}
