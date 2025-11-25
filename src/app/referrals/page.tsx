"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Users, Copy, DollarSign, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([])
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Загружаем тех, кого я пригласил
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('referred_by', user.id)
        
        if (data) setReferrals(data)
      }
      setLoading(false)
    }
    getData()
  }, [supabase])

  const copyLink = () => {
    navigator.clipboard.writeText(`${origin}?ref=${userId}`)
    alert("Ссылка скопирована!")
  }

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Партнерская программа</h1>
        <p className="text-gray-400 mb-8">Приглашайте друзей и получайте бонусы</p>

        {/* Карточка со ссылкой */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 p-6 rounded-2xl mb-10">
          <p className="text-sm text-blue-200 mb-2 font-semibold uppercase tracking-wider">Ваша уникальная ссылка</p>
          <div className="flex flex-col md:flex-row gap-4">
            <code className="bg-black/50 p-4 rounded-xl flex-1 text-blue-100 font-mono text-sm border border-blue-500/20 truncate">
              {origin}?ref={userId}
            </code>
            <button 
              onClick={copyLink}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Copy size={18} /> Копировать
            </button>
          </div>
        </div>

        {/* Статистика (Грид 3 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard title="Приглашено друзей" value={referrals.length} icon={Users} color="bg-green-500" />
          <StatCard title="Заработано (Demo)" value="0 ₽" icon={DollarSign} color="bg-yellow-500" />
          <StatCard title="Конверсия" value="0%" icon={TrendingUp} color="bg-purple-500" />
        </div>

        {/* Список приглашенных */}
        <h2 className="text-xl font-bold mb-4">Ваши рефералы</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {referrals.length > 0 ? (
            referrals.map((ref, i) => (
              <div key={ref.id} className="p-4 border-b border-gray-800 flex items-center gap-4 hover:bg-white/5 transition">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <div>
                   <div className="font-bold">{ref.full_name || "Без имени"}</div>
                   <div className="text-xs text-gray-500">{ref.email}</div>
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  {new Date(ref.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Пока никого нет. Отправьте ссылку другу!
            </div>
          )}
        </div>
      </motion.div>
    </main>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-20 flex items-center justify-center text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase font-bold">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}