'use client'
// Импорты Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'

// Импорты стилей (обязательно!)
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    title: 'Технологии будущего',
    desc: 'Мы строим веб-платформы нового поколения.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    title: 'Безопасность данных',
    desc: 'Ваша информация под надежной защитой Supabase.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    title: 'Работаем в команде',
    desc: 'Администрирование, чаты и управление пользователями.'
  }
]

export default function HeroSlider() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade" // Красивое затухание вместо листания
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true} // Стрелочки
        loop={true}
        className="w-full h-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Картинка */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] hover:scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Затемнение */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Текст по центру */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl max-w-2xl opacity-90 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                  {slide.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Кастомные стили для точек и стрелок (чтобы были белыми) */}
      <style jsx global>{`
        .swiper-pagination-bullet { background: white; opacity: 0.5; }
        .swiper-pagination-bullet-active { opacity: 1; }
        .swiper-button-next, .swiper-button-prev { color: white; opacity: 0; transition: opacity 0.3s; }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev { opacity: 1; }
      `}</style>
    </div>
  )
}