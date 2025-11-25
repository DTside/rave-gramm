import { Suspense } from 'react' // <--- 1. ВАЖНО: Добавляем импорт
import AuthForm from '@/components/AuthForm'
import HeroSlider from '@/components/HeroSlider'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      
      {/* Слайдер */}
      <HeroSlider />

      {/* Секция входа */}
      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-10">
        
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Добро пожаловать в <span className="text-blue-600">rave.gramm</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Это демонстрационная версия профессиональной платформы. Здесь реализованы все современные функции: от авторизации до real-time чатов и админ-панели.
          </p>
          <div className="flex gap-4 justify-center md:justify-start text-sm font-semibold text-gray-500">
             <span>● Next.js 14</span>
             <span>● Supabase</span>
             <span>● Tailwind</span>
          </div>
        </div>

        {/* 2. ВАЖНО: Оборачиваем форму в Suspense */}
        <Suspense fallback={<div className="text-white">Загрузка...</div>}>
           <AuthForm />
        </Suspense>

      </section>

    </main>
  )
}