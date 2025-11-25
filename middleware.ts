import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // ПРОВЕРКА: Если ключей нет, просто пропускаем (сайт загрузится, но вход не сработает)
    if (!supabaseUrl || !supabaseKey) {
      console.error("⚠️ ОШИБКА: Нет ключей Supabase в настройках Vercel!")
      return res
    }

    const supabase = createMiddlewareClient({ req, res }, {
      supabaseUrl,
      supabaseKey
    })

    await supabase.auth.getSession()
    
  } catch (e) {
    // Если произошла любая другая ошибка — игнорируем её, чтобы не было 500
    console.error("Middleware error:", e)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}