import AuthForm from '@/components/AuthForm'
import HeroSlider from '@/components/HeroSlider' // Импорт слайдера

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Слайдер во всю ширину */}
      <HeroSlider />

      {/* 2. Секция с формой входа */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Левая колонка: Текст */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
            Добро пожаловать в <span className="text-blue-600">ProWeb</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Это демонстрационная версия профессиональной платформы. 
            Здесь реализованы все современные функции: от авторизации 
            до real-time чатов и админ-панели.
          </p>
          
          <div className="flex gap-4 text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Next.js 14
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Supabase
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Tailwind
            </div>
          </div>
        </div>

        {/* Правая колонка: Форма */}
        <div className="flex justify-center">
          <AuthForm />
        </div>

      </div>
    </main>
  )
}