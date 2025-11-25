"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Users, Settings, Shield, LogOut, LayoutGrid } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Скрываем навигацию на странице входа (главная /)
  if (pathname === "/") return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const menuItems = [
    { name: "Главная", href: "/dashboard", icon: Home },
    { name: "Рефералы", href: "/referrals", icon: Users },
    { name: "Профиль", href: "/settings", icon: Settings },
    // Админку показываем всем, но пустит туда только админа (проверка внутри страницы)
    { name: "Админка", href: "/admin", icon: Shield },
  ]

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Слева) --- */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-black border-r border-gray-800 p-6 z-50"
      >
        {/* Логотип */}
        <div className="text-2xl font-bold font-serif text-white mb-10 tracking-wide pl-2">
          rave.gramm
        </div>

        {/* Меню */}
        <div className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? "text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}>
                  {/* Активный индикатор (полоска) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600/10 rounded-xl border border-blue-600/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon size={24} className={isActive ? "text-blue-500" : "group-hover:text-blue-400 transition-colors"} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Кнопка выхода */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-auto"
        >
          <LogOut size={24} />
          <span className="font-medium text-sm">Выйти</span>
        </button>
      </motion.div>


      {/* --- MOBILE BOTTOM BAR (Снизу) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around z-50 px-2">
        {menuItems.map((item) => {
           const isActive = pathname === item.href
           return (
             <Link key={item.href} href={item.href} className="relative p-3">
                {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-blue-600/20 rounded-full blur-md"
                    />
                  )}
               <item.icon 
                 size={24} 
                 className={isActive ? "text-blue-500 relative z-10" : "text-gray-500 relative z-10"} 
               />
             </Link>
           )
        })}
        <button onClick={handleLogout} className="p-3 text-red-500">
           <LogOut size={24} />
        </button>
      </div>
    </>
  )
}