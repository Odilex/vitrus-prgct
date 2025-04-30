"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Camera, Smartphone, PanelTop, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const steps = [
    {
      icon: Camera,
      title: "Capture",
      description:
        "We scan and photograph your space with high-resolution equipment, capturing every detail with precision.",
      color: "from-[#8E8E9D] to-[#B5B5C3]",
    },
    {
      icon: PanelTop,
      title: "Process",
      description: "Our technology transforms raw data into immersive 3D environments with stunning visual fidelity.",
      color: "from-[#8E8E9D] to-[#B5B5C3]",
    },
    {
      icon: Smartphone,
      title: "Experience",
      description:
        "Access your digital space from any device, anywhere in the world, with intuitive navigation controls.",
      color: "from-[#8E8E9D] to-[#B5B5C3]",
    },
  ]

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-[#F5F5F7] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-[#000423] to-[#F5F5F7] z-10" />
      <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-[#000423] to-[#F5F5F7] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(142,142,157,0.1),transparent)] z-0" />

      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-64 h-64 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-[#8E8E9D]/10 rounded-full text-sm text-[#5A5A6A] font-medium mb-4">
            Our Process
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-gradient bg-gradient-to-r from-[#5A5A6A] to-[#8E8E9D] text-transparent bg-clip-text">
            How We Create Immersive Experiences
          </h2>
          <p className="text-gray-600 text-lg">
            Our streamlined process transforms physical spaces into captivating digital experiences with precision and
            care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="mb-6 relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#8E8E9D] text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <>
                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-[#8E8E9D]" />
                    </div>
                    <div className="md:hidden flex justify-center mt-4 mb-4">
                      <ArrowRight className="w-5 h-5 text-[#8E8E9D] transform rotate-90" />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <a
              href="#contact"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 flex items-center group"
            >
              Learn More About Our Process
              <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
