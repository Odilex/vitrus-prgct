import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import FloatingNav from "@/components/floating-nav"
import PolicyConsent from "@/components/policy-consent"

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
  keywords: [
    "virtual tours Rwanda",
    "360 real estate tours Kigali",
    "Matterport Rwanda",
    "immersive virtual tours Africa",
    "3D property tours Kigali",
    "real estate marketing Rwanda"
  ],
  metadataBase: new URL("https://vitrus.rw"),
  openGraph: {
    title: "Vitrus | Transform Spaces with Immersive Digital Journeys",
    description:
      "Create stunning 3D virtual tours of any space with our cutting-edge technology. Perfect for real estate, museums, hotels, and more.",
    url: "https://vitrus.rw",
    siteName: "Vitrus",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vitrus Virtual Tours"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitrus | Transform Spaces with Immersive Digital Journeys",
    description:
      "Create stunning 3D virtual tours of any space with our cutting-edge technology. Perfect for real estate, museums, hotels, and more.",
    images: ["/og-image.png"]
  },
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
        <link rel="icon" href="/favicon.PNG" type="image/png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-916894803341135"
          crossOrigin="anonymous"
        ></script>
              {/* Google Analytics 4 */}
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX'); // TODO: replace with your GA4 measurement ID
          `}
        </Script>
      </head>
      <body className={`scroll-smooth ${outfit.variable} ${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FloatingNav />
          {children}
          <PolicyConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
