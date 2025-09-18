"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Info, ImageIcon, MessageSquare, Menu, X, Users, Layers } from "lucide-react"

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling down 300px to avoid overlapping with hero content
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Determine active section
      const sections = ["hero", "about", "services", "portfolio", "how-it-works", "testimonials", "contact"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Adjusted threshold to better detect current section
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "hero", label: "Home", icon: <Home className="w-4 h-4" /> },
    {/* id: "portfolio", label: "Portfolio", icon: <ImageIcon className="w-4 h-4" /> */ },
    { id: "how-it-works", label: "Process", icon: <Info className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
    { id: "services", label: "Services", icon: <Layers className="w-4 h-4" /> },
    { id: "testimonials", label: "Testimonials", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "contact", label: "Contact", icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-[25%] transform -translate-x-1/2 z-50"
          >
            <div className="flex md:block flex-row-reverse items-center fixed md:static top-4 right-4 z-[100] md:z-50 w-auto px-2 sm:px-4" style={{gap: 8}}>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2.5 text-white rounded-full bg-[#000423] hover:bg-[#1a1e3a] transition-colors duration-300"
                aria-label="Open navigation menu"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex bg-[#000423]/70 backdrop-blur-lg border border-white/10 rounded-full px-3 py-2 shadow-lg shadow-black/10 md:static items-center">
                <div className="flex items-center space-x-3">
                  {navItems.map((item, idx) => (
                    <a
                      key={item.id || idx}
                      href={`#${item.id}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-1.5">{item.label}</span>
                    </a>
                  ))}
                  <a
                    href="#contact"
                    className="ml-2 px-5 py-2 bg-white text-[#000423] rounded-full text-sm font-medium hover:bg-opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-white/10"
                  >
                    Book a Demo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#000423]/90 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-white p-2.5 hover:bg-white/10 rounded-full transition-colors duration-300"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center space-y-4 sm:space-y-6 w-full px-6 max-h-[80vh] overflow-y-auto py-12"
            >
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.id || idx}
                  href={`#${item.id}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.1, type: "spring", stiffness: 100 }}
                  className={`text-lg sm:text-xl font-medium flex items-center px-6 py-3 rounded-full w-full justify-center ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </motion.a>
              ))}

              <motion.a
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                href="#contact"
                className="mt-4 px-8 py-3 bg-white text-[#000423] rounded-full font-medium hover:shadow-md hover:shadow-white/10 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Demo
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
