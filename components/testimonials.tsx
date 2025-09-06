"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { QuoteIcon } from "lucide-react"

const testimonials = [
  {
    quote:
      "The virtual tour created for our apartments exceeded all expectations. Our bookings increased by 30% after adding it to our website.",
    author: "Sarah Mutoni",
    role: "Marketing Director",
    company: "flex apartments",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Our clients can now preview our properties before their visit, dramatically improving the overall experience and engagement.",
    author: "Michael Chen",
    role: "Curator",
    company: "imboni housing",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "As a real estate agency, these immersive tours have revolutionized how we showcase properties, especially to international buyers.",
    author: "Jessica Williams",
    role: "Principal Agent",
    company: "Elite Properties",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} id="testimonials" className="py-24 bg-[#000423] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(142,142,157,0.05),transparent)] z-0" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#8E8E9D]/5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/4" />
      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-[#F5F5F7] to-[#000423] z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-[#B5B5C3] font-medium mb-4">
            Testimonials
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-white">What Our Clients Say</h2>
          <p className="text-white/70 text-lg">
            Hear from businesses and organizations that have transformed their digital presence with our immersive tours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative h-full">
                <div className="bg-gradient-to-br from-[#0A0E2E] to-[#151A3A] border border-[#3A3A5A] rounded-2xl p-6 sm:p-8 backdrop-blur-sm h-full hover:shadow-lg hover:shadow-[#000423]/20 transition-all duration-300">
                  <QuoteIcon className="w-10 h-10 text-[#8E8E9D]/60 mb-4" />
                  <p className="text-gray-300 mb-6 relative z-10 text-lg font-light italic">{testimonial.quote}</p>

                  <div className="flex items-center">
                    <div className="mr-4 w-12 h-12 relative overflow-hidden rounded-full bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] p-[2px]">
                      <div className="rounded-full overflow-hidden w-full h-full">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{testimonial.author}</h4>
                      <p className="text-gray-400 text-sm">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-tr from-[#8E8E9D]/10 to-[#B5B5C3]/10 rounded-full blur-xl" />
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-tr from-[#8E8E9D]/10 to-[#B5B5C3]/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            Read More Success Stories
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
