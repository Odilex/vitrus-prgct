"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-[#000423] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_100%,rgba(142,142,157,0.05),transparent)] z-0" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img src="/logo.png" alt="Vitrus Logo" className="h-10 w-auto mr-3 rounded-lg bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] p-1" />
              <h3 className="text-white font-bold text-xl font-outfit">Vitrus</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Transforming physical spaces into captivating digital experiences through cutting-edge 3D tour technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/Vitrusrwanda" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#1DA1F2] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/vitrus_rw/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E1306C] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/vitrus-tech/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#0077B5] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-outfit">Services</h3>
            <ul className="space-y-4">
              <FooterLink href="#portfolio">Residential Property Tours</FooterLink>
              <FooterLink href="#portfolio">Commercial Space Scanning</FooterLink>
              <FooterLink href="#portfolio">Museum & Gallery Tours</FooterLink>
              <FooterLink href="#portfolio">Hotel & Resort Experiences</FooterLink>
              <FooterLink href="#portfolio">Custom VR Development</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-outfit">Company</h3>
            <ul className="space-y-4">
              <FooterLink href="#hero">About Us</FooterLink>
              <FooterLink href="#testimonials">Our Team</FooterLink>
              <FooterLink href="#contact">Careers</FooterLink>
              <FooterLink href="#contact">Press & Media</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 font-outfit">Resources</h3>
            <ul className="space-y-4">
              <FooterLink href="#how-it-works">Blog</FooterLink>
              <FooterLink href="#portfolio">Case Studies</FooterLink>
              <FooterLink href="#how-it-works">Documentation</FooterLink>
              <FooterLink href="#how-it-works">Technology</FooterLink>
              <FooterLink href="#contact">Privacy Policy</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#1A1E3A] flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} Vitrus. All rights reserved.
            <br />
            <a href="#"  className="text-gray-400 hover:text-white text-sm transition-colors mb-2 sm:mb-0">
              Powered by Lumion Dev</a>
          </p>

          <div className="flex items-center space-x-4 sm:space-x-6 flex-wrap justify-center">
            <a href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 sm:mb-0">
              Terms of Service
            </a>
            <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 sm:mb-0">
              Privacy Policy
            </a>
            <a href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors mb-2 sm:mb-0">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Chat bubble - positioned with higher z-index to avoid conflicts */}
       

        {/* Scroll to top button - positioned with proper spacing to avoid overlap
        
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            className="relative p-4 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] rounded-full shadow-lg shadow-[#8E8E9D]/20 hover:shadow-xl hover:shadow-[#8E8E9D]/30 transition-all duration-300 group"
            aria-label="Open chat"
          >
            <span className="sr-only">Open chat</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#121212]"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

            <span className="absolute -top-2 -right-2 bg-white text-[#8E8E9D] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>

            <div className="absolute bottom-full right-0 mb-3 origin-bottom-right scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
              <div className="bg-white text-[#121212] p-3 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
                Ready to digitize your space? 👋
              </div>
            </div>
          </button>
        </motion.div>
        */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full bg-[#0A0E2E] flex items-center justify-center text-gray-400 hover:bg-[#8E8E9D] hover:text-white transition-colors duration-200"
      aria-label={label}
    >
      {icon}
    </a>
  )
}

function FooterLink({ children, href = "#" }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-400 hover:text-[#B5B5C3] transition-colors duration-200 flex items-center group"
      >
        <span className="w-1 h-1 bg-[#8E8E9D] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
        {children}
      </a>
    </li>
  )
}
