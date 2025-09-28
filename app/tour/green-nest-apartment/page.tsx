"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Maximize, Minimize2, Maximize2, Share2, Eye, Calendar, MapPin, Copy, Code } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function green_nest_apartment() {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showShareDropdown, setShowShareDropdown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
    setShowShareDropdown(false)
  }

  const requestEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/tour/green-nest-apartment" width="100%" height="600" frameborder="0" allowfullscreen title="Green Nest Apartment Virtual Tour"></iframe>`
    
    navigator.clipboard.writeText(embedCode).then(() => {
      alert('Embed code copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy embed code: ', err)
      // Fallback: show the embed code in a prompt
      prompt('Copy this embed code:', embedCode)
    })
    
    setShowShareDropdown(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }



  return (
    <div className="min-h-screen bg-[#000423] text-white">
      {/* Logo - Only visible on scroll */}
      {isScrolled && (
        <div className="fixed top-6 left-6 z-50 transition-all duration-300">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <Image
              src="/logo.png"
              alt="Vitrus Logo"
              width={64}
              height={64}
              className="h-16 w-auto drop-shadow-lg"
            />
            <div className="flex flex-col ml-2">
              <span className="font-outfit text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Vitrus</span>
              <span className="text-sm md:text-lg bg-gradient-to-r from-[#8E8E9D] to-[#B5B5C3] text-transparent bg-clip-text font-semibold">Digital Journeys</span>
            </div>
          </Link>
        </div>
      )}

      {/* Tour Controls */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
        <Link
          href="/#portfolio"
          className="p-3 bg-black/80 backdrop-blur-sm text-white rounded-full hover:bg-black/90 transition-all duration-300 shadow-lg"
          title="Back to Portfolio"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Tour Viewer */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-40 bg-black' : ''} relative`}>
        <div className="w-full relative" style={{ height: isFullscreen ? '100vh' : '85vh' }}>
          <iframe
            id="tour-iframe"
            width="100%"
            height="100%"
            src="https://my.matterport.com/show/?m=asUPJZMybAg&brand=0&qs=1&help=0&hr=0&sb=0&nt=0&mls=1&mt=0&search=0&kb=0&dh=0&ts=0&pin=0&gt=0&st=0&ui=0&fs=0&vr=0&guides=0&title=0&lang=en"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; web-share; xr-spatial-tracking; gyroscope; accelerometer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            className="w-full h-full"
          />
          {/* Custom Fullscreen Button - Above Alert */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-16 right-6 z-50 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 shadow-lg"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {/* Hide Matterport's native fullscreen button */}
          <style jsx global>{`
            /* Hide all Matterport UI controls */
            iframe#tour-iframe {
              position: relative;
            }
            
            /* Target Matterport's internal elements */
            iframe[src*="matterport.com"] {
              --matterport-ui-display: none;
            }
            
            /* Hide various Matterport control selectors */
            .matterport-viewer [data-testid="fullscreen-button"],
            .matterport-viewer .fullscreen-button,
            .matterport-viewer .mp-fullscreen-button,
            .matterport-viewer .controls-fullscreen,
            .matterport-viewer .ui-fullscreen,
            .matterport-viewer .matterport-ui,
            .matterport-viewer .ui-controls,
            .matterport-viewer .control-bar,
            .matterport-viewer .toolbar {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
            
            /* Block interaction area where Matterport controls appear */
            .tour-viewer::after {
              content: '';
              position: absolute;
              bottom: 0;
              right: 0;
              width: 100px;
              height: 100px;
              background: transparent;
              z-index: 45;
              pointer-events: none;
            }
          `}</style>
          {/* Zoom Alert - Yellow full width */}
          <div className="absolute bottom-3 left-0 right-0 z-10 bg-yellow-500/100 text-black text-center px-4" style={{height: '47px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <p className="font-medium">If objects seem too close, please zoom out</p>
          </div>
        </div>
      </div>

      {/* Tour Details */}
      {!isFullscreen && (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-3 py-1 bg-[#8E8E9D]/20 backdrop-blur-sm rounded-full text-sm text-[#B5B5C3] font-medium mb-4">
                Apartment
              </div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white">
                  Green Nest Apartment
                </h1>
                <div className="relative">
                  <button
                    onClick={() => setShowShareDropdown(!showShareDropdown)}
                    className="p-3 bg-black/80 backdrop-blur-sm text-white rounded-full hover:bg-black/90 transition-all duration-300 shadow-lg flex items-center gap-2"
                    title="Share Tour"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                  
                  {/* Share Dropdown */}
                  {showShareDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={copyToClipboard}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                      <button
                        onClick={requestEmbedCode}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Code className="w-4 h-4" />
                        Get Embed Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Discover modern apartment living in this beautifully designed space featuring contemporary 
                interiors, thoughtful layouts, and quality finishes. This comprehensive tour showcases 
                comfortable living areas, well-appointed bedrooms, and functional spaces that create 
                the perfect environment for urban living.
              </p>

              {/* Tour Stats */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Eye className="w-8 h-8 text-[#8E8E9D] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">Type</div>
                  <div className="text-white/60 text-sm">Apartment</div>
                </div>
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Calendar className="w-8 h-8 text-[#8E8E9D] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/60 text-sm">Available</div>
                </div>
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <MapPin className="w-8 h-8 text-[#8E8E9D] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">3</div>
                  <div className="text-white/60 text-sm">Rooms</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">Tour Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Modern Kitchen Appliances",
                    "Spacious Living Areas",
                    "Natural Light Throughout",
                    "Quality Flooring",
                    "Updated Bathrooms",
                    "Convenient Location"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-[#8E8E9D] rounded-full mr-3" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Tour Gallery</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Green Nest Apartment Images */}
                <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                   <Image
                     src="/Green-Nest-Apartment-Bathroom.jpg"
                     alt="Green Nest Apartment - Bathroom"
                     width={300}
                     height={300}
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                   <Image
                     src="/Green-Nest-Apartment-Bedroom.jpg"
                     alt="Green Nest Apartment - Bedroom"
                     width={300}
                     height={300}
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                   <Image
                     src="/Green-Nest-Apartment-Kitchen.jpg"
                     alt="Green Nest Apartment - Kitchen"
                     width={300}
                     height={300}
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                   <Image
                     src="/Green-Nest-Apartment-Living-Room.jpg"
                     alt="Green Nest Apartment - Living Room"
                     width={300}
                     height={300}
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                   />
                 </div>
              </div>

              {/* Additional Info */}
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Tour Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Duration:</span>
                    <span className="text-white">Self-paced</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Type:</span>
                    <span className="text-white">Interactive 3D</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Quality:</span>
                    <span className="text-white">4K Ultra HD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Compatibility:</span>
                    <span className="text-white">All Devices</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      )}

    </div>
  )
}