import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/Navigation" // <--- Импорт

const fontMain = Manrope({ 
  subsets: ['cyrillic', 'latin'], 
  variable: '--font-main' 
})

export const metadata: Metadata = {
  title: "rave.gramm",
  description: "Social media app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${fontMain.variable} font-sans antialiased bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          
          {/* Навигация будет видна везде, кроме страницы входа */}
          <Navigation />

          {/* Сдвигаем контент на десктопе вправо, чтобы не залезал под меню */}
          <div className="md:pl-[240px]">
            {children}
          </div>

        </ThemeProvider>
      </body>
    </html>
  )
}