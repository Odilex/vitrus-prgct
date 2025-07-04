"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Send, Mail, Phone, MapPin, Check } from "lucide-react"

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formStatus, setFormStatus] = useState({ submitted: false, loading: false })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.project) {
      errors.project = "Please select a project type"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setFormStatus({ submitted: false, loading: true })

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitted: true, loading: false })
      // Reset form data
      setFormData({
        name: "",
        email: "",
        project: "",
        message: "",
      })
    }, 1500)
  }

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
                    <a href="mailto:vitrusrwanda@gmail.com" className="text-gray-800 hover:text-[#8E8E9D] transition-colors">
                    vitrusrwanda@gmail.com
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
            {formStatus.submitted ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#8E8E9D]/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-[#8E8E9D]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-outfit">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setFormStatus({ submitted: false, loading: false })}
                  className="px-6 py-2 bg-[#8E8E9D]/10 hover:bg-[#8E8E9D]/20 text-gray-700 rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      formErrors.name ? "border-red-300" : "border-gray-200"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200`}
                    placeholder="John Doe"
                    aria-required="true"
                    aria-invalid={formErrors.name ? "true" : "false"}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      formErrors.email ? "border-red-300" : "border-gray-200"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200`}
                    placeholder="john@example.com"
                    aria-required="true"
                    aria-invalid={formErrors.email ? "true" : "false"}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      formErrors.project ? "border-red-300" : "border-gray-200"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200`}
                    aria-required="true"
                    aria-invalid={formErrors.project ? "true" : "false"}
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
                  {formErrors.project && <p className="mt-1 text-sm text-red-500">{formErrors.project}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      formErrors.message ? "border-red-300" : "border-gray-200"
                    } rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E8E9D]/50 focus:border-transparent transition-all duration-200`}
                    placeholder="Tell us about your project..."
                    aria-required="true"
                    aria-invalid={formErrors.message ? "true" : "false"}
                  ></textarea>
                  {formErrors.message && <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-white font-medium rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-[#8E8E9D]/20 transition-all duration-300 group disabled:opacity-70"
                  aria-label="Submit contact form"
                >
                  {formStatus.loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
