import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import FloatingNav from "@/components/floating-nav"
import PolicyConsent from "@/components/policy-consent"
import { SITE_URL } from "@/lib/seo"

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
  title: "Vitrus Rwanda | 360° Virtual Tours for Properties & Spaces",
  description:
    "See it before you book it. Vitrus Rwanda creates immersive virtual tours for Airbnbs, workspaces, and businesses across Rwanda.",
  keywords: [
    "virtual tours Rwanda",
    "360 real estate tours Kigali",
    "Matterport Rwanda",
    "immersive virtual tours Africa",
    "3D property tours Kigali",
    "real estate marketing Rwanda",
    "vitrus Rwanda",
    "scenography company in rwanda",
    "virtual tour company",
    "airbnb rwanda",
    "airbnb tours",
  ],
  metadataBase: new URL("https://vitrus.rw"),
  openGraph: {
    title: "Vitrus Rwanda | 360° Virtual Tours for Properties & Spaces",
    description:
      "See it before you book it. Vitrus Rwanda creates immersive virtual tours for Airbnbs, workspaces, and businesses across Rwanda.",
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
    title: "Vitrus Rwanda | 360° Virtual Tours for Properties & Spaces",
    description:
      "See it before you book it. Vitrus Rwanda creates immersive virtual tours for Airbnbs, workspaces, and businesses across Rwanda.",
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
        <link rel="canonical" href={SITE_URL} />
        <meta name="robots" content="index,follow" />
        <Script id="ld-org-json" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vitrus",
            url: SITE_URL,
            logo: `${SITE_URL}/og-image.png`,
            sameAs: [
              "https://www.linkedin.com/company/vitrus-tech",
              "https://x.com/Vitrusrwanda",
              "https://www.instagram.com/vitrus_rw/"
            ]
          })}
        </Script>
        <Script id="ld-local-json" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Vitrus Rwanda",
            image: `${SITE_URL}/og-image.png`,
            url: SITE_URL,
            telephone: "+250-786-493-820",
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              streetAddress: "KN 1 Ave",
              addressLocality: "Kigali",
              addressRegion: "Kigali City",
              postalCode: "0000",
              addressCountry: "RW"
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -1.94995,
              longitude: 30.05885
            },
            openingHoursSpecification: [{
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
              opens: "09:00",
              closes: "17:00"
            }],
            sameAs: [
              "https://www.linkedin.com/company/vitrus/",
              "https://x.com/Vitrusrwanda",
              "https://www.instagram.com/vitrus_rw/"
            ]
          })}
        </Script>
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
