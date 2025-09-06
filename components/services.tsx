"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Building2, Building, Landmark, Home, Hotel, PanelTop, ArrowRight } from "lucide-react"
import { getImageWithFallback } from "@/lib/imageUtils"

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const services = [
    {
      icon: Building2,
      title: "Commercial Real Estate",
      description:
        "Showcase office spaces, retail locations, and commercial properties with immersive 3D tours that highlight key features and amenities.",
      image: "/pic7.jpg",
      color: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      icon: Home,
      title: "Residential Properties",
      description:
        "Transform residential listings with virtual walkthroughs that give potential buyers an authentic feel for the space and layout.",
      image: "/pic5.jpg",
      color: "from-[#8B5CF6] to-[#6D28D9]",
    },
    {
      icon: Landmark,
      title: "Cultural Institutions",
      description:
        "Create virtual exhibitions and tours for museums, galleries, and cultural sites that extend reach beyond physical limitations.",
      image: "/museum.jpg",
      color: "from-[#EC4899] to-[#BE185D]",
    },
    {
      icon: Hotel,
      title: "Hospitality & Tourism",
      description:
        "Enhance guest experiences for hotels, resorts, and tourist destinations with interactive previews of accommodations and facilities.",
      image: "/culture.jpg",
      color: "from-[#F59E0B] to-[#D97706]",
    },
    {
      icon: Building,
      title: "Educational Campuses",
      description:
        "Provide virtual campus tours for schools and universities, helping prospective students explore facilities from anywhere.",
      image: "/education.jpg",
      color: "from-[#10B981] to-[#059669]",
    },
    {
      icon: PanelTop,
      title: "Custom Solutions",
      description:
        "Develop bespoke immersive experiences tailored to your specific industry needs with our advanced technology stack.",
      image: "/pic2.jpg",
      color: "from-[#8E8E9D] to-[#6B7280]",
    },
  ]

  return (
    <section ref={ref} id="services" className="py-24 bg-[#000423] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(142,142,157,0.05),transparent_70%)] z-0" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#8E8E9D]/5 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#8E8E9D]/5 blur-3xl rounded-full transform -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#B5B5C3] font-medium mb-4">
            Our Services
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-white">
            Immersive Solutions for Every Space
          </h2>
          <p className="text-white/70 text-lg">
            We offer a comprehensive range of digital tour services tailored to different industries and needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              className="bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-white/5 rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-[#8E8E9D]/5 transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={getImageWithFallback(service.image, 'service')}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000423] via-[#000423]/50 to-transparent opacity-60" />

                <div className="absolute top-4 left-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/60 mb-6">{service.description}</p>

                <a
                  href="#contact"
                  className="inline-flex items-center text-[#B5B5C3] hover:text-white transition-colors group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="px-8 py-3 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 inline-flex items-center group"
          >
            Discuss Your Project
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
