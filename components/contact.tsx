"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Send, Mail, Phone, MapPin, Check } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [submitted, setSubmitted] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  return (
    <section ref={ref} id="contact" className="py-24 bg-[#F5F5F7] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-[#000423] to-[#F5F5F7] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(142,142,157,0.1),transparent_70%)] z-0" />

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-[#8E8E9D]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 bg-[#8E8E9D]/10 rounded-full text-sm text-[#5A5A6A] font-medium mb-4">
            Get In Touch
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Ready to Transform Your Space?
          </h2>
          <p className="text-gray-600 text-lg">
            Contact us today to discuss how we can create an immersive digital experience for your property or venue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-outfit">Contact Information</h3>
                <p className="text-gray-600 mb-6">
                  Our team is ready to answer any questions about our immersive digital tour services
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center flex-wrap sm:flex-nowrap">
                  <div className="w-12 h-12 rounded-full bg-[#8E8E9D]/10 flex items-center justify-center mr-4 mb-4 sm:mb-0">
                    <Mail className="w-5 h-5 text-[#8E8E9D]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <a href="mailto:contact@vitrus.rw" className="text-gray-800 hover:text-[#8E8E9D] transition-colors">
                    contact@vitrus.rw
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8E8E9D]/10 flex items-center justify-center mr-4">
                    <Phone className="w-5 h-5 text-[#8E8E9D]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <a href="tel:+250780217221" className="text-gray-800 hover:text-[#8E8E9D] transition-colors">
                      +250 780 217 221
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8E8E9D]/10 flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-[#8E8E9D]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-800">Norrsken House, 1 KN 78 St, Kigali</p>
                  </div>
                </div>
              </div>

            {/*  <div className="pt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Our Service Areas</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["New York", "Los Angeles", "Chicago", "Miami", "San Francisco", "Seattle"].map((city) => (
                    <span key={city} className="px-3 py-1 bg-[#8E8E9D]/10 rounded-full text-sm text-gray-700">
                      {city}
                    </span>
                  ))}
                </div>
              </div>*/}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {submitted ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                <Check className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-gray-800 font-outfit">Thank You!</h3>
                <p className="text-gray-600 text-center mb-2">Your message has been sent successfully. We appreciate your interest and will get back to you soon.</p>
              </div>
            ) : (
              <form
                action="https://formspree.io/f/xyzpkaqn"
                method="POST"
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
                onSubmit={() => setSubmitted(true)}
              >
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    pattern="[+]?\d{7,15}"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. +250780217221"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="project"
                    name="project"
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" disabled>
                      Select your project type
                    </option>
                    <option value="residential">Residential Property</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="cultural">Museum or Gallery</option>
                    <option value="hospitality">Hotel or Resort</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 group"
                  aria-label="Submit contact form"
                >
                  Send Message
                  <Send className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
        {/* Newsletter Subscription */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xl font-bold mb-2 text-gray-800 font-outfit text-center">Subscribe to our Newsletter</h4>
            <p className="text-gray-600 text-center mb-4 text-sm">Get updates about our latest projects and offers.</p>
            <AnimatePresence mode="wait">
              {!newsletterSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    await fetch('https://formspree.io/f/xyzpkaqn', {
                      method: 'POST',
                      body: formData,
                      headers: { 'Accept': 'application/json' },
                    });
                    setNewsletterSubmitted(true);
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200"
                    placeholder="Your email address"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300"
                    aria-label="Subscribe"
                  >
                    Subscribe
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-center flex flex-col items-center justify-center"
                >
                  <span className="text-2xl text-green-600 font-bold mb-2">Thank you!</span>
                  <span className="text-gray-700">You’ve been subscribed to our newsletter.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
