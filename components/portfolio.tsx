"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, Eye, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const router = useRouter()

  const [showAlert, setShowAlert] = useState(false)
  
  const handleDiscoverClick = () => {
    setShowAlert(true)
  }
  
  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  return (
    <section ref={ref} id="portfolio" className="py-24 bg-[#000423] relative overflow-hidden">
      {/* Coming Soon Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCloseAlert}
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative bg-gradient-to-r from-[#0A0E2E] to-[#151A3A] border border-[#3A3A5A] rounded-lg p-8 max-w-md text-center text-white shadow-lg">
              <button className="absolute top-2 right-2 text-white hover:text-gray-200" onClick={handleCloseAlert}>
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-lg">Our discovery page is currently under development. Check back soon!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
            Discover how we&apos;ve transformed physical spaces into captivating digital experiences for clients across
            various industries
          </p>
        </motion.div>

        {/* Virtual Tours Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Virtual Tour Card 1 - Interactive Space */}
           <Link href="/tour/green-nest-apartment">
             <motion.div
               whileHover={{ y: -10, scale: 1.02 }}
               transition={{ duration: 0.3 }}
               className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#8E8E9D]/30 group cursor-pointer"
             >
               <div className="relative h-64 overflow-hidden">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   src="https://my.matterport.com/show/?m=asUPJZMybAg&brand=0&help=0&hr=0&sb=0&qs=1&nt=0&play=0" 
                   frameBorder="0" 
                   allow="web-share; xr-spatial-tracking"
                   className="w-full h-full rounded-t-2xl pointer-events-none"
                 />
                 <div className="absolute top-4 right-4">
                   <span className="px-3 py-1 bg-[#8E8E9D]/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                     Apartment
                   </span>
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="text-xl font-semibold text-white mb-2">Green Nest Apartment</h3>
                 <p className="text-white/70 mb-4 text-sm">
                   Explore the comfortable living spaces of Green Nest Apartment. This virtual tour showcases modern interiors, thoughtful layouts, and quality finishes that make this apartment an ideal urban home.
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-[#B5B5C3] text-sm">
                     <Eye className="w-4 h-4 mr-1" />
                     <span>3.2k views</span>
                   </div>
                   <div className="px-4 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white text-sm rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center group">
                     Explore Now
                     <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                   </div>
                 </div>
               </div>
             </motion.div>
           </Link>

          {/* Virtual Tour Card 2 - Professional Space */}
           <Link href="/tour/harrington-apartment-d03">
             <motion.div
               whileHover={{ y: -10, scale: 1.02 }}
               transition={{ duration: 0.3, delay: 0.1 }}
               className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#8E8E9D]/30 group cursor-pointer"
             >
               <div className="relative h-64 overflow-hidden">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   src="https://my.matterport.com/show/?m=JtMz7gcTyHJ&brand=0" 
                   frameBorder="0" 
                   allowFullScreen 
                   allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                   className="w-full h-full rounded-t-2xl pointer-events-none"
                 />
                 <div className="absolute top-4 right-4">
                   <span className="px-3 py-1 bg-[#8E8E9D]/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      Apartment
                   </span>
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="text-xl font-semibold text-white mb-2">Harrington Apartment D03</h3>
                 <p className="text-white/70 mb-4 text-sm">
                   Step into a modern apartment showcase highlighting stylish interiors, smart layouts, and essential amenities. This virtual tour offers a complete overview of the property's atmosphere and functionality.
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-[#B5B5C3] text-sm">
                     <Eye className="w-4 h-4 mr-1" />
                     <span>4.7k views</span>
                   </div>
                   <div className="px-4 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white text-sm rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center group">
                     Explore Now
                     <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                   </div>
                 </div>
               </div>
             </motion.div>
           </Link>

          {/* Virtual Tour Card 3 - Luxury Space */}
           <Link href="/tour/harrington-apartment-do2">
             <motion.div
               whileHover={{ y: -10, scale: 1.02 }}
               transition={{ duration: 0.3, delay: 0.2 }}
               className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#8E8E9D]/30 group cursor-pointer"
             >
               <div className="relative h-64 overflow-hidden">
                  <iframe 
                     width="100%" 
                     height="100%" 
                     src="https://my.matterport.com/show/?m=rTKvTdm7Hh3&brand=0" 
                     frameBorder="0" 
                     allowFullScreen 
                     allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                     className="w-full h-full rounded-t-2xl pointer-events-none"
                   />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#8E8E9D]/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      Apartment
                    </span>
                  </div>
                </div>
               <div className="p-6">
                 <h3 className="text-xl font-semibold text-white mb-2">Harrington Apartment DO2</h3>
                 <p className="text-white/70 mb-4 text-sm">
                   Discover premium living through this luxury apartment tour. Featuring high-end finishes, elegant design, and sophisticated spaces, it provides a first-class virtual presentation of refined modern living.
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center text-[#B5B5C3] text-sm">
                     <Eye className="w-4 h-4 mr-1" />
                     <span>5.8k views</span>
                   </div>
                   <div className="px-4 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white text-sm rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center group">
                     Explore Now
                     <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                   </div>
                 </div>
               </div>
             </motion.div>
           </Link>
        </motion.div>

        {/* Discover More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleDiscoverClick}
            className="px-8 py-4 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center mx-auto group"
          >
            <Eye className="w-5 h-5 mr-2" />
            Discover More Properties
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>


      </div>
    </section>
  )
}
