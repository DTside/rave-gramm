"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import StoriesGallery from "@/components/StoriesGallery"
import FeedPost from "@/components/FeedPost"
import UserWidget from "@/components/UserWidget"
import ChatWidget from "@/components/ChatWidget"

// ДЕМО ДАННЫЕ
const STORIES = [
  { id: 1, username: 'alex_dev', avatar: 'https://i.pravatar.cc/150?u=1', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 2, username: 'maria_ui', avatar: 'https://i.pravatar.cc/150?u=2', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80' },
  { id: 3, username: 'travel_pro', avatar: 'https://i.pravatar.cc/150?u=3', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
  { id: 4, username: 'foodie_ka', avatar: 'https://i.pravatar.cc/150?u=4', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
  { id: 5, username: 'gym_life', avatar: 'https://i.pravatar.cc/150?u=5', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
]

const POSTS = [
  { 
    id: 1, 
    username: 'alex_dev', 
    avatar: 'https://i.pravatar.cc/150?u=1', 
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80', 
    likes: 124, 
    caption: 'Пишу код на Next.js 🚀 #coding #webdev' 
  },
  { 
    id: 2, 
    username: 'maria_ui', 
    avatar: 'https://i.pravatar.cc/150?u=2', 
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80', 
    likes: 890, 
    caption: 'Новый дизайн-проект готов! Оцените от 1 до 10 🔥' 
  },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) // <--- Состояние загрузки
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // getSession быстрее и надежнее для проверки "вошел ли я прямо сейчас"
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("Нет сессии, редирект на главную...")
          router.push('/')
        } else {
          console.log("Пользователь найден:", session.user.email)
          setUser(session.user)
        }
      } catch (error) {
        console.error("Ошибка проверки:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()
  }, [supabase, router])

  // Если идет проверка — показываем черный экран или спиннер
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Загрузка...</div>
  }

  // Если проверки нет и юзера нет — ничего не рендерим (уже сработал редирект)
  if (!user) return null

  return (
    <main className="min-h-screen bg-white dark:bg-black pb-20">
      
      {/* ХЕДЕР */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-xl font-bold font-serif tracking-wide text-black dark:text-white ">raveos.gramm</h1>
        {/* ... иконки ... */}
      </header>

      {/* Основной контейнер с ограничением ширины */}
      <div className="max-w-5xl mx-auto pt-6 flex justify-center items-start">
        
        {/* ЛЕВАЯ КОЛОНКА (Сторис + Посты) */}
        <div className="w-full max-w-[630px] flex flex-col gap-8">
            
            {/* СТОРИС */}
            <StoriesGallery stories={STORIES} />

            {/* ЛЕНТА */}
            <div>
                {POSTS.map(post => (
                <FeedPost key={post.id} {...post} />
                ))}
            </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Профиль + Рефералка) */}
        {/* Она скрыта на мобильных и видна на больших экранах (lg:block) */}
        <UserWidget />

      </div> {/* Конец контейнера колонок */}
      
      {/* Плавающий чат */}
      <ChatWidget />

    </main>
  )
}