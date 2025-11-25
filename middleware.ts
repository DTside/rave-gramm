import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Пытаемся подключиться
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
  } catch (e) {
    // Если ошибка — НИЧЕГО НЕ ДЕЛАЕМ.
    // Просто разрешаем сайту загрузиться дальше.
    console.log("Supabase Middleware Error (Ignored):", e)
  }

  return res
}

export const config = {
  matcher: [
    // Исключаем статические файлы, чтобы не нагружать систему
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}