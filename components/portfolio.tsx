"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, Mail, ArrowRight, Clock } from "lucide-react"

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} id="portfolio" className="py-24 bg-[#000423] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(142,142,157,0.05),transparent_70%)] z-0" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#8E8E9D]/5 to-[#B5B5C3]/3 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 15,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-[#8E8E9D]/5 to-[#B5B5C3]/3 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 18,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#B5B5C3] font-medium mb-4">
            Our Portfolio
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-white">Explore Our Vitrus Projects</h2>
          <p className="text-white/70 text-lg">
            Discover how we've transformed physical spaces into captivating digital experiences for clients across
            various industries
          </p>
        </motion.div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-[#3A3A5A] rounded-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] rounded-full mx-auto flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-[#000423]" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-outfit">Portfolio Coming Soon</h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              We're currently working on some exciting Vitrus digital experiences. Our portfolio will be updated soon
              with stunning examples of our work.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Calendar className="w-10 h-10 text-[#8E8E9D] mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Launch Date</h4>
              <p className="text-white/70">
                Our portfolio is scheduled to launch in Q3 2023 with our first collection of immersive projects.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Mail className="w-10 h-10 text-[#8E8E9D] mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Stay Updated</h4>
              <p className="text-white/70">
                Subscribe to our newsletter or contact us directly to be notified when our portfolio launches.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            <a
              href="#services"
              className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              Explore Our Services
            </a>
          </motion.div>
        </motion.div>

        {/* Teaser Images - Blurred/Coming Soon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-16 opacity-20">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.3 + item * 0.1 }}
              className="aspect-video relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-white/5"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/50 font-medium">Coming Soon</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
