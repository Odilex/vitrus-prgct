"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Users, Target, Award, Zap } from "lucide-react"

export default function AboutUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "200+", label: "Projects Completed" },
    { value: "50+", label: "Team Members" },
    { value: "98%", label: "Client Satisfaction" },
  ]
 
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible in immersive digital experiences.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We work closely with our clients to ensure their vision is realized in every detail.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in every aspect of our digital tour creation process .",
    },
    {
      icon: Zap,
      title: "Impact",
      description: "We create experiences that leave lasting impressions and deliver measurable results.",
    },
  ]

  return (
    <section ref={ref} id="about" className="py-24 bg-[#000423] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(142,142,157,0.05),transparent_70%)] z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#B5B5C3] font-medium mb-4">
            About Us
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-white">Pioneering Digital Immersion</h2>
          <p className="text-white/70 text-lg">
            We&apos;re a team of passionate creators, technologists, and visionaries dedicated to transforming how people
            experience spaces digitally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                <Image
                  src="/pic5.jpg"
                  alt="Our team working on an immersive project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000423] via-transparent to-transparent opacity-40"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#8E8E9D] to-[#B5B5C3] rounded-xl z-10 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">10</div>
                  <div className="text-sm">Years of Innovation</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4 font-outfit">Our Story</h3>
            <p className="text-white/70 mb-6">
              Founded in 2014, Vitrus began with a simple mission: to break down the barriers between physical spaces
              and digital experiences. What started as a small team of innovators has grown into a global leader in
              immersive digital solutions.
            </p>
            <p className="text-white/70 mb-8">
              Today, we combine cutting-edge technology with artistic vision to create digital experiences that
              captivate, inform, and inspire. Our team of specialists brings expertise from diverse fields including 3D
              modeling, photography, software development, and user experience design.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-outfit">Our Values</h3>
          <p className="text-white/70">
            These core principles guide everything we do, from how we work with clients to how we develop our
            technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-white/5 rounded-xl p-6 hover:shadow-lg hover:shadow-[#8E8E9D]/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#8E8E9D] to-[#B5B5C3] rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
              <p className="text-white/60">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-20 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            Meet Our Team
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
