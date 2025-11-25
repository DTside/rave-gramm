"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Send } from "lucide-react"

export type Story = {
  id: number
  username: string
  avatar: string
  image: string
}

interface StoriesGalleryProps {
  stories: Story[]
}

export default function StoriesGallery({ stories }: StoriesGalleryProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const activeStory = stories.find((s) => s.id === activeId)

  return (
    <div className="w-full">
      {/* --- ЛЕНТА СТОРИС (КРУЖОЧКИ) --- */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 scrollbar-hide bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveId(story.id)}
            className="flex flex-col items-center gap-2 min-w-[72px] transition-transform hover:scale-105"
          >
            {/* Градиентная рамка */}
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="p-[2px] bg-white dark:bg-black rounded-full">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs font-medium truncate w-16 text-center text-gray-700 dark:text-gray-300">
              {story.username}
            </span>
          </button>
        ))}
      </div>

      {/* --- MODAL (OVERLAY) --- */}
      <AnimatePresence>
        {activeId && activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // z-50 и fixed inset-0 гарантируют перекрытие всего экрана
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            {/* Кнопка закрыть (справа сверху) */}
            <button
              onClick={() => setActiveId(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2"
            >
              <X size={32} />
            </button>

            {/* --- КОНТЕЙНЕР "ТЕЛЕФОН" --- */}
            <div className="relative w-full max-w-md aspect-[9/16] max-h-[90vh] flex flex-col overflow-hidden bg-black rounded-2xl shadow-2xl border border-white/10">
              
              {/* Прогресс-бар */}
              <div className="absolute top-3 left-3 right-3 flex gap-1 z-30">
                <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              {/* Хедер (Аватар + Имя) */}
              <div className="absolute top-6 left-3 flex items-center gap-2 z-30">
                <img 
                  src={activeStory.avatar} 
                  className="w-8 h-8 rounded-full border border-white/20" 
                />
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm drop-shadow-md leading-none">
                        {activeStory.username}
                    </span>
                </div>
              </div>

              {/* 3D CONTENT AREA */}
              <div className="flex-1 relative w-full h-full perspective-1000 bg-gray-900">
                <motion.img
                  key={activeStory.id}
                  src={activeStory.image}
                  initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 70, 
                    damping: 15,
                    mass: 1 
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Градиент снизу для читаемости текста */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />
              </div>

              {/* UI СНИЗУ */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-30 flex items-center gap-3">
                <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Отправить сообщение..." 
                      className="w-full bg-transparent border border-white/40 rounded-full py-2.5 px-4 text-sm text-white placeholder:text-white/70 focus:outline-none focus:border-white transition-colors backdrop-blur-md"
                    />
                </div>
                <button className="text-white hover:text-red-500 transition-colors">
                    <Heart size={28} />
                </button>
                <button className="text-white hover:text-blue-400 transition-colors">
                    <Send size={28} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}