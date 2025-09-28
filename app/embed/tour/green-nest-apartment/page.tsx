"use client"

import { useState, useEffect } from "react"
import { Maximize2, Minimize2 } from "lucide-react"

export default function EmbedTour() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        const element = document.documentElement
        if (element.requestFullscreen) {
          await element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen()
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error)
    }
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Tour Viewer - Full Screen */}
      <div className="w-full h-full relative">
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
        
        {/* Custom Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-16 right-6 z-50 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-300 shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        
        {/* Hide Matterport's native controls */}
        <style jsx global>{`
          iframe#tour-iframe {
            position: relative;
          }
          
          iframe[src*="matterport.com"] {
            --matterport-ui-display: none;
          }
          
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
        `}</style>
        
        {/* Zoom Alert */}
        <div className="absolute bottom-3 left-0 right-0 z-10 bg-yellow-500/100 text-black text-center px-4" style={{height: '47px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <p className="font-medium">If objects seem too close, please zoom out</p>
        </div>
      </div>
    </div>
  )
}