"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100])

  useEffect(() => {
    setIsClient(true)
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
          >
            <source src="/videos/vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000423]/70 via-[#000423]/50 to-[#000423]/70 z-10"></div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 sm:p-3 rounded-full bg-[#000423]/20 backdrop-blur-md border border-[#8E8E9D]/30 hover:bg-[#000423]/40 transition-all duration-300 text-[#B5B5C3]"
            aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
          >
            {isMuted ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
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
