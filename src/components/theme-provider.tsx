"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Этот компонент нужен, чтобы Next.js не ругался на клиентский код в layout
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}