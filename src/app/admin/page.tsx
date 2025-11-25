'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('') // <--- Текст поиска

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      // ЗАМЕНИ ЭТОТ БЛОК:
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('*') // <--- Стало просто "взять всё", без сложных связей
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Ошибка загрузки:", error) // Выведем ошибку в консоль, если что
      }
      if (allUsers) setUsers(allUsers)
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    const nameMatch = (user.full_name || '').toLowerCase().includes(searchLower)
    const idMatch = user.id.toLowerCase().includes(searchLower)
    // Если захотим искать по email, его надо было бы запрашивать отдельно, 
    // но пока ищем по Имени и ID
    return nameMatch || idMatch
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-white bg-gray-900">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Шапка с кнопкой выхода */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
            Admin Panel
          </h1>
          <button onClick={() => router.push('/dashboard')} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
            Вернуться в кабинет
          </button>
        </div>

        {/* Блок статистики и поиска */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Статистика */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
             <div className="text-gray-400 text-sm mb-1">Всего пользователей</div>
             <div className="text-4xl font-bold">{users.length}</div>
          </div>

          {/* ПОИСК (ЛУПА) */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center">
            <div className="relative w-full">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <input 
                type="text"
                placeholder="Найти по имени или ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">
            Список ({filteredUsers.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Роль</th>
                  <th className="p-4">Кем приглашен</th>
                  <th className="p-4">Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} className="w-10 h-10 rounded-full object-cover bg-gray-600" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                          {user.full_name ? user.full_name[0] : '?'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{user.full_name || 'Нет имени'}</div>
                        <div className="text-xs text-gray-500 font-mono">{user.id.slice(0, 8)}...</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300">
                      {/* Если есть referrer_id — показываем его кусочек, иначе прочерк */}
                      {user.referrer_id ? (
                        <span className="flex items-center gap-1 text-green-400 font-mono text-xs">
                          <span>↗</span> ID: {user.referrer_id.slice(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Никого не найдено по запросу "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}