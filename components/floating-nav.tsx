'use client'

import { useState, useEffect } from 'react'
import { Home, Building, Users, Phone, Menu, X } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'hero',
    label: 'Home',
    icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  {
    id: 'about',
    label: 'About',
    icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
  }
]

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > 80)

      // Update active section based on scroll position with better detection
      const sections = ['hero', 'portfolio', 'about', 'how-it-works', 'services', 'testimonials', 'contact']
      const aboutRelatedSections = ['about', 'how-it-works', 'services', 'testimonials']
      let currentSection = 'hero' // default
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const offset = window.innerHeight * 0.3 // 30% of viewport height
          if (rect.top <= offset && rect.bottom >= offset) {
            // Map process, services, testimonials to about for navigation highlighting
            if (aboutRelatedSections.includes(section)) {
              currentSection = 'about'
            } else {
              currentSection = section
            }
          }
        }
      }
      
      setActiveSection(currentSection)
    }

    // Close mobile menu on scroll
    const handleScrollClose = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Close mobile menu on resize
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScrollClose, { passive: true })
    window.addEventListener('resize', handleResize)
    
    // Initial call
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScrollClose)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Desktop floating nav */}
      <div className={`fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out hidden md:block ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'
      }`}>
        <nav className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:from-white/15 hover:via-white/10 hover:to-white/15">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === item.id
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                <span className="ml-2 hidden lg:inline transition-all duration-200">{item.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="ml-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] hover:from-[#9E9EAD] hover:to-[#C5C5D3] text-white rounded-full text-xs sm:text-sm font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            >
              <span className="hidden sm:inline">Book a Demo</span>
              <span className="sm:hidden">Demo</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 md:hidden p-3 sm:p-4 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 active:scale-95 hover:from-white/15 hover:via-white/10 hover:to-white/15 ${
          isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 -translate-y-4 rotate-180 pointer-events-none'
        }`}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center relative">
          {isMenuOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-all duration-300 rotate-0" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-all duration-300" />
          )}
        </div>
      </button>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" 
          onClick={() => setIsMenuOpen(false)} 
        />
        <div className={`absolute top-16 sm:top-20 right-4 sm:right-6 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 border border-white/20 min-w-[280px] sm:min-w-[320px] shadow-2xl transition-all duration-500 transform ${
          isMenuOpen ? 'translate-y-0 opacity-100 scale-100 rotate-0' : '-translate-y-8 opacity-0 scale-95 rotate-3'
        }`}>
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group text-base sm:text-lg font-medium flex items-center px-4 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white shadow-lg'
                    : 'text-white hover:bg-white/15 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                <span className="ml-3 sm:ml-4 transition-all duration-200">{item.label}</span>
              </a>
            ))}
            <div className="h-px bg-white/10 my-2 sm:my-3" />
            <a
              href="#contact"
              className="px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 text-center hover:scale-[1.02] active:scale-[0.98] transform"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
