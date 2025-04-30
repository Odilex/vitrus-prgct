"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { navItems } from "@/lib/navData"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Determine active section
      const sections = ["hero", "about", "services", "portfolio", "how-it-works", "testimonials", "contact"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#000423]/80 backdrop-blur-lg border-b border-slate-700/20 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-xl">
              <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-500">Vitrus</span>Tours
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative ${
                    activeSection === item.href.substring(1) ? "text-cyan-400" : ""
                  }`}
                >
                  {item.name}
                  {activeSection === item.href.substring(1) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white rounded-full transition-all duration-300">
                Book a Demo
              </button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#000423]/90 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-4">
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close mobile menu">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`text-xl hover:text-cyan-400 transition-colors duration-300 ${
                      activeSection === item.href.substring(1) ? "text-cyan-400" : "text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full"
                >
                  Book a Demo
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
