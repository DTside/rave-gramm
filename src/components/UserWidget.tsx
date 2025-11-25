"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Copy, User } from "lucide-react"
import Link from "next/link"

export default function UserWidget() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    // Получаем текущий домен сайта (localhost или реальный)
    setOrigin(window.location.origin)

    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Загружаем данные из таблицы profiles
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(data)
      }
      setLoading(false)
    }
    getProfile()
  }, [supabase])

  const copyLink = () => {
    if (!profile) return
    const link = `${origin}?ref=${profile.id}`
    navigator.clipboard.writeText(link)
    alert("Ссылка скопирована!")
  }

  if (loading) return <div className="text-gray-500 text-sm">Загрузка профиля...</div>
  if (!profile) return null

  return (
    <div className="hidden lg:block w-[320px] pl-8">
      {/* Мини-профиль */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-700">
             {profile.avatar_url ? (
               <img src={profile.avatar_url} alt="Ava" className="w-full h-full object-cover" />
             ) : (
               <User className="text-gray-400" />
             )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-900 dark:text-white">
                {profile.full_name || profile.email?.split('@')[0]}
            </span>
            <span className="text-gray-500 text-xs">{profile.email}</span>
          </div>
        </div>
        <Link 
  href="/settings" 
  className="text-blue-500 text-xs font-bold hover:text-white transition-colors"
>
  Перейти
</Link>
      </div>

      {/* Реферальный блок */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <h3 className="text-gray-500 text-xs font-bold uppercase mb-3">Ваша реферальная ссылка</h3>
        
        <div className="flex items-center gap-2 bg-white dark:bg-black p-2 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
          <code className="text-xs truncate flex-1 text-gray-600 dark:text-gray-300">
            {origin}?ref={profile.id}
          </code>
          <button onClick={copyLink} className="hover:text-blue-500 transition">
            <Copy size={16} />
          </button>
        </div>

        <p className="text-[10px] text-gray-400">
          Отправьте эту ссылку другу. Когда он зарегистрируется, вы увидите это в статистике.
        </p>
      </div>

      {/* Футер */}
      <div className="mt-8 text-xs text-gray-300">
        © 2025 RAVEOS.GRAMM FROM PROWEB
      </div>
    </div>
  )
}