"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Данные формы
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  // 1. Загружаем данные при входе
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      // Берем профиль из базы
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || "")
        setAvatarUrl(profile.avatar_url || "")
      }
      setLoading(false)
    }
    getData()
  }, [supabase, router])

  // 2. Логика загрузки фото
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Выберите файл для загрузки.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${Math.random()}.${fileExt}`

      // Загружаем в бакет 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Получаем публичную ссылку
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)

    } catch (error: any) {
      alert('Ошибка загрузки фото: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // 3. Сохранение изменений
  const updateProfile = async () => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      alert('Профиль обновлен!')
      router.refresh() // Обновляем данные на сайте
      router.push('/dashboard') // Возвращаемся назад

    } catch (error: any) {
      alert('Ошибка сохранения: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Загрузка...</div>

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      
      {/* Хедер */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Редактировать профиль</h1>
        <div className="w-8" /> {/* Пустой блок для центровки */}
      </div>

      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Аватар */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-gray-600 transition">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">
                  Нет фото
                </div>
              )}
            </div>
            
            {/* Оверлей загрузки */}
            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Camera size={32} />}
              <input 
                type="file" 
                accept="image/*" 
                onChange={uploadAvatar} 
                className="hidden" 
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-sm text-blue-500 font-semibold cursor-pointer">Изменить фото профиля</p>
        </div>

        {/* Поля ввода */}
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold ml-1">Имя пользователя</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-bold ml-1">Email (нельзя изменить)</label>
            <input 
              type="text" 
              value={user.email} 
              disabled 
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 mt-1 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Кнопка сохранить */}
        <button 
          onClick={updateProfile}
          disabled={saving}
          className="mt-6 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="animate-spin" size={20} />}
          Сохранить изменения
        </button>

      </div>
    </main>
  )
}