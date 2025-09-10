"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showFixedLogo, setShowFixedLogo] = useState(false)
  const ref = useRef(null)
  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [0, 0.8], [1, 0])
  const scale = useTransform(scrollY, [0, 0.8], [1, 0.8])
  const y = useTransform(scrollY, [0, 0.8], [0, 100])

  useEffect(() => {
    setIsClient(true)
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowFixedLogo(true)
      } else {
        setShowFixedLogo(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    const video = document.getElementById("bgVideo") as HTMLVideoElement
    if (video) {
      video.muted = !video.muted
    }
  }

  // Animated shapes
  const shapes = [
    { initialX: -5, initialY: -5, delay: 0, duration: 8 },
    { initialX: 105, initialY: 15, delay: 1, duration: 10 },
    { initialX: 80, initialY: 90, delay: 2, duration: 9 },
    { initialX: -10, initialY: 80, delay: 3, duration: 11 },
    { initialX: 50, initialY: -10, delay: 1.5, duration: 12 },
  ]

  return (
    <section ref={ref} id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      {isClient && (
        <>
          <video
            id="bgVideo"
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onError={(e) => {
              console.error('Video loading error:', e);
              // Fallback to alternative video or image
            }}
          >
            <source src="/videos/bcvideo.mp4" type="video/mp4" />
            <source src="/videos/vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000423]/70 via-[#000423]/50 to-[#000423]/70 z-10"></div>

         
        </>
      )}

      {/* Animated shapes - reduced opacity for better readability */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute z-20 w-32 h-32 rounded-full bg-gradient-to-r from-[#8E8E9D]/5 to-[#B5B5C3]/3 blur-3xl"
          initial={{
            x: `${shape.initialX}vw`,
            y: `${shape.initialY}vh`,
            opacity: 0.2,
          }}
          animate={{
            x: [`${shape.initialX}vw`, `${shape.initialX + 10}vw`, `${shape.initialX}vw`],
            y: [`${shape.initialY}vh`, `${shape.initialY - 10}vh`, `${shape.initialY}vh`],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: shape.duration,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      {/* Hero Content */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-20 h-full flex flex-col items-center justify-center px-4 md:px-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="font-outfit text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block"
              >
                Vitrus
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-transparent bg-clip-text"
              >
                Digital Journeys
              </motion.span>
            </motion.h1>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Fixed Logo on Scroll (always visible, text animates in) */}
      <motion.div
        initial={{ opacity: 1, x: 0, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50 flex items-center bg-transparent"
        style={{ pointerEvents: 'none' }}
      >
        <img src="/logo.png" alt="Vitrus Logo" className="h-16 w-auto drop-shadow-lg transition-all duration-300" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={showFixedLogo ? { opacity: 1, x: 0, marginLeft: 8 } : { opacity: 0, x: -20, marginLeft: 24 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <span className="font-outfit text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Vitrus</span>
          <span className="text-sm md:text-lg bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-transparent bg-clip-text font-semibold">Digital Journeys</span>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <a href="#portfolio" className="flex flex-col items-center group">
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M20 5V35M20 35L35 20M20 35L5 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 2.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              />
            </svg>
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}
