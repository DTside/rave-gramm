import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Создаем Supabase клиент для middleware
  const supabase = createMiddlewareClient({ req, res })

  // Эта строчка обновляет сессию (куки), если она истекает
  await supabase.auth.getSession()

  return res
}

// Указываем, на каких путях должен работать middleware
export const config = {
  matcher: [
    /*
     * Применяем ко всем путям, кроме:
     * - _next/static (статические файлы)
     * - _next/image (оптимизация картинок)
     * - favicon.ico (иконка)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}