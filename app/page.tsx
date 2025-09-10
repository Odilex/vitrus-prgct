import Hero from "@/components/hero"
import AboutUs from "@/components/about-us"
import Services from "@/components/services"
import Portfolio from "@/components/portfolio"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Script from "next/script"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000423] text-white overflow-hidden">
      <Hero />
      <Portfolio /> 
      <HowItWorks />
      <AboutUs />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
          {/* LocalBusiness Schema */}
      <Script type="application/ld+json" id="ld-localbusiness" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vitrus',
          image: 'https://vitrus.rw/og-image.png',
          url: 'https://vitrus.rw',
          telephone: '+250XXXXXXXXX',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Kigali',
            addressLocality: 'Kigali',
            addressRegion: 'Kigali City',
            postalCode: '00000',
            addressCountry: 'RW'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '-1.94995',
            longitude: '30.05885'
          },
          sameAs: [
            'https://www.facebook.com/yourpage',
            'https://www.instagram.com/yourprofile'
          ]
        })}
      </Script>
    </main>
  )
}
