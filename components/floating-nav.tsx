'use client'

import { useState, useEffect } from 'react'
import { Home, Building, Users, Phone } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'hero',
    label: 'Home',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: <Building className="w-5 h-5" />
  },
  {
    id: 'about',
    label: 'About',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Phone className="w-5 h-5" />
  }
]

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > 100)

      // Update active section based on scroll position
      const sections = navItems.map(item => item.id)
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Desktop floating nav */}
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <nav className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/10">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="ml-2 hidden sm:inline">{item.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="ml-2 px-6 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Book a Demo
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-6 right-6 z-50 lg:hidden p-3 bg-black/80 backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </div>
      </button>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-20 right-6 bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[200px] transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-lg font-medium flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="mt-4 px-6 py-3 bg-white text-black rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-center"
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
