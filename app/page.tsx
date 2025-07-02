import Hero from "@/components/hero"
import AboutUs from "@/components/about-us"
import Services from "@/components/services"
import Portfolio from "@/components/portfolio"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000423] text-white overflow-hidden">
      <Hero />
     {/* <Portfolio /> */} 
      <HowItWorks />
      <AboutUs />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
