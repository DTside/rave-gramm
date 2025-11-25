"use client"

import { useState, useEffect } from 'react'
// ВАЖНО: Импортируем именно этот клиент, а не из @/lib/supabase
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Создаем клиент прямо внутри компонента
  const supabase = createClientComponentClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      setReferrer(refFromUrl)
      localStorage.setItem('ref_id', refFromUrl)
    } else {
      const storedRef = localStorage.getItem('ref_id')
      if (storedRef) setReferrer(storedRef)
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault() // Обязательно блокируем перезагрузку формы
    setLoading(true)

    if (isLogin) {
      // --- ВХОД ---
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
        setLoading(false)
      } else {
        // Успешный вход -> Жесткая перезагрузка на дашборд
        // (чтобы сервер точно увидел новые куки)
        window.location.href = '/dashboard'
      }
    } else {
      // --- РЕГИСТРАЦИЯ ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            referrer_id: referrer,
          },
        },
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Регистрация прошла успешно! Проверьте почту или войдите.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
      
      {/* Заголовок */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
      </h2>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          required
        />

        {/* Чекбокс "Запомнить" (визуальный) */}
        {isLogin && (
            <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id="remember" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="remember" className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                Запомнить меня
            </label>
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          {isLogin ? 'Нет аккаунта? Создать' : 'Есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}