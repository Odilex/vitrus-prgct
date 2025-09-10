"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Eye } from "lucide-react"
import PropertyCard from "@/components/property-card"
import { Property } from "@/lib/types/property"
import propertyService from "@/lib/api/property"
import { useRouter } from "next/navigation"

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const router = useRouter()
  const [latestProperties, setLatestProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestProperties = async () => {
      try {
        setLoading(true)
        const properties = await propertyService.getAll()
        // Get the 3 most recent properties
        const sortedProperties = properties.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        setLatestProperties(sortedProperties.slice(0, 3))
      } catch (error) {
        console.error('Error fetching properties:', error)
        setLatestProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProperties()
  }, [])

  const handleDiscoverClick = () => {
    // For now, show alert for coming soon discovery page
    alert('Coming Soon: Discovery Page!')
    // Later this will be: router.push('/discovery')
  }

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
            Discover how we&apos;ve transformed physical spaces into captivating digital experiences for clients across
            various industries
          </p>
        </motion.div>

        {/* Latest Properties Showcase */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E8E9D] mx-auto mb-4"></div>
            <p className="text-white/70 text-lg">Loading latest properties...</p>
          </motion.div>
        ) : latestProperties.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12"
            >
              {latestProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/property/${property.id}`)}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center py-16 bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-[#3A3A5A] rounded-2xl backdrop-blur-sm"
          >
            <p className="text-white/70 text-lg mb-6">No properties available at the moment.</p>
            <button
              onClick={handleDiscoverClick}
              className="px-8 py-3 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center mx-auto group"
            >
              <Eye className="w-5 h-5 mr-2" />
              Explore Properties
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        )}


      </div>
    </section>
  )
}
