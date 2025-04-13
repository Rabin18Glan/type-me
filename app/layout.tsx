import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TypingProvider } from "@/features/typing/context/typing-context"
import PWARegister from "@/app/pwa-register"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "TypeMe - Modern Typing Practice App",
  description: "Improve your typing speed and accuracy with TypeMe's interactive practice sessions",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TypingProvider>
            <div className="min-h-screen bg-slate-900 text-white">{children}</div>
            <Toaster />
            <PWARegister />
          </TypingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'