import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import FloatingNav from "@/components/floating-nav"

// Font setup
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Vitrus | Transform Spaces with Immersive Digital Journeys",
  description:
    "Create stunning 3D virtual tours of any space with our cutting-edge technology. Perfect for real estate, museums, hotels, and more.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`scroll-smooth ${outfit.variable} ${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FloatingNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
