import { Heart, MessageCircle, Send, Bookmark } from "lucide-react"

interface FeedPostProps {
  username: string
  avatar: string
  image: string
  likes: number
  caption: string
}

export default function FeedPost({ username, avatar, image, likes, caption }: FeedPostProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
      {/* Шапка поста */}
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600">
           <img src={avatar} alt={username} className="w-8 h-8 rounded-full border border-white dark:border-black" />
        </div>
        <span className="font-semibold text-sm">{username}</span>
      </div>

      {/* ФОТОГРАФИЯ (на всю ширину) */}
      <div className="w-full aspect-square bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
        <img 
          src={image} 
          alt="Post" 
          className="w-full h-full object-cover" // <--- ЗАПОЛНЯЕТ ВСЁ МЕСТО
        />
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-4">
          <button className="hover:text-red-500 transition"><Heart size={26} /></button>
          <button className="hover:text-blue-500 transition"><MessageCircle size={26} /></button>
          <button className="hover:text-green-500 transition"><Send size={26} /></button>
        </div>
        <button><Bookmark size={26} /></button>
      </div>

      {/* Лайки и текст */}
      <div className="px-3 pt-2">
        <p className="font-bold text-sm mb-1">{likes} отметок "Нравится"</p>
        <p className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </p>
      </div>
    </div>
  )
}