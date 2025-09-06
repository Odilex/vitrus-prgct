"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/lib/types/property";
import { propertyService } from "@/lib/api/property";
import { motion } from "framer-motion";
import { MapPin, Home, Building2, Share2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Footer from "@/components/footer";
import Link from "next/link";
import VirtualTour from "@/components/virtual-tour";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          const foundProperty = await propertyService.getById(id as string);
          setProperty(foundProperty);
        } catch (error) {
          console.error('Error fetching property:', error);
          setProperty(null);
        }
      }
    };
    
    fetchProperty();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-[#000423] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Property not found</h2>
          <Link href="/discovery" className="text-cyan-400 hover:text-cyan-300">
            Back to Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000423] text-white">
      <div className="pt-8 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back to Discovery Link */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              href="/discovery" 
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Discovery
            </Link>
          </motion.div>
          
          {/* Property Title and Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400 leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-300 text-lg">
              <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>
          </motion.div>
          
          {/* Virtual Tour */}
          {property.virtualTourUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-12"
            >
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Virtual Tour</h2>
                <p className="text-gray-400">Experience this property in immersive 360°</p>
              </div>
              <VirtualTour 
                tourUrl={property.virtualTourUrl}
                propertyTitle={property.title}
                fallbackImage={property.images[0]}
                className="w-full"
              />
            </motion.div>
          )}
          
          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Left Column - Property Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Property Details</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Type</div>
                    <div className="font-semibold text-lg text-white">{property.type}</div>
                  </div>
                  
                  {property.rooms && (
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Rooms</div>
                      <div className="font-semibold text-lg text-white">{property.rooms}</div>
                    </div>
                  )}
                  
                  {property.floors && (
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Floors</div>
                      <div className="font-semibold text-lg text-white">{property.floors}</div>
                    </div>
                  )}
                  
                  {property.price && (
                    <div className="bg-gradient-to-br from-cyan-900/30 to-slate-800/50 p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                      <div className="text-cyan-300 text-sm mb-2 uppercase tracking-wide">Price</div>
                      <div className="font-bold text-xl text-cyan-100">${property.price?.toLocaleString()}</div>
                    </div>
                  )}
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Description</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{property.description}</p>
                </div>
                
                {property.features && Array.isArray(property.features) && property.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-white">Features & Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-4 py-3 rounded-lg border border-slate-600/30 hover:border-cyan-500/40 transition-all duration-300">
                          <span className="text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Property Images */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {property.images && Array.isArray(property.images) && property.images.map((image, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="relative h-64 rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 group cursor-pointer"
                    >
                      <Image 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Contact and Share */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 sticky top-24">
                <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">Contact Owner</h3>
                
                {property.owner && (
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                    <div className="text-cyan-300 text-sm mb-2 uppercase tracking-wide font-medium">Property Owner</div>
                    <div className="font-bold text-lg text-white">{property.owner.name}</div>
                  </div>
                )}
                
                {property.owner && (
                  <div className="space-y-4 mb-8">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                      asChild
                    >
                      <a href={`https://wa.me/${property.owner.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </Button>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      asChild
                    >
                      <a href={`mailto:${property.owner.email}`}>
                        <Mail className="h-5 w-5" />
                        Email
                      </a>
                    </Button>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-slate-500/25 transition-all duration-300"
                      asChild
                    >
                      <a href={`tel:${property.owner.phone}`}>
                        <Phone className="h-5 w-5" />
                        Call
                      </a>
                    </Button>
                  </div>
                )}
                
                <div className="border-t border-slate-700/50 pt-6">
                  <div className="text-cyan-300 text-sm mb-3 uppercase tracking-wide font-medium">Share Property</div>
                  <Button 
                    onClick={handleCopyLink}
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    {copied ? (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5" />
                        Copy Property Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}