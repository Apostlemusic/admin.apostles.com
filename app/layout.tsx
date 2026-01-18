import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Apostles Admin",
  description: "Professional management for your content ecosystem.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Apostle-Logo-sm.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/Apostle-Logo-sm.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/Apostle-Logo-sm.png",
        type: "image/png",
      },
    ],
    apple: "/Apostle-Logo-sm.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
