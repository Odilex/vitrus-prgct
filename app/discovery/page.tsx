"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/property-card";
import PropertySearch from "@/components/property-search";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import { Property } from "@/lib/types/property";
import { PropertyService } from "@/lib/propertyService";
import { ErrorHandler } from "@/lib/errorHandler";
import Link from "next/link";
import Image from "next/image";

export default function DiscoveryPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  useEffect(() => {
    // Fetch properties from the API
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await PropertyService.getAll();
        
        const formattedProperties = (result || []).map((prop: Property) => ({
          ...prop,
          // Ensure images array exists
          images: prop.images || ['/placeholder-property.jpg']
        }));
        
        setAllProperties(formattedProperties);
        setFilteredProperties(formattedProperties);
      } catch (err) {
        const errorMessage = ErrorHandler.handle(err);
        setError(`Failed to load properties: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
  const handleSearch = (query: string, type: string, location: string) => {
    let results = [...allProperties];
    
    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        `${property.city}, ${property.state}`.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by property type
    if (type && type !== "All Types") {
      results = results.filter(property => property.propertyType === type);
    }
    
    // Filter by location
    if (location && location !== "All Locations") {
      results = results.filter(property => `${property.city}, ${property.state}`.includes(location));
    }
    
    setFilteredProperties(results);
  };

  return (
    <div className="min-h-screen bg-[#000423] text-white">
      {/* Logo */}
      <div className="fixed top-6 left-6 z-50">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(142,142,157,0.12),transparent)] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.08),transparent)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(142,142,157,0.05),rgba(6,182,212,0.05))] z-0" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400 leading-tight drop-shadow-lg">
              Discover Virtual Tours
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Explore properties in Rwanda through immersive 360° virtual tours before visiting in person.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <PropertySearch onSearch={handleSearch} />
          </motion.div>
          
          {/* Property Grid */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
                Featured Properties
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto drop-shadow-sm">
                Discover our handpicked selection of premium properties with virtual tours
              </p>
            </motion.div>
            
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-800/30 backdrop-blur-sm"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>
                <p className="text-gray-300 text-xl font-medium drop-shadow-sm">Loading properties...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest listings</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20 bg-red-900/20 rounded-2xl border border-red-800/50 backdrop-blur-sm"
              >
                <div className="text-7xl mb-6 drop-shadow-lg">⚠️</div>
                <p className="text-red-300 text-xl mb-2 font-medium drop-shadow-sm">{error}</p>
                <p className="text-red-400/70 text-sm mb-8">Something went wrong while loading the properties</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 drop-shadow-lg"
                >
                  Try Again
                </button>
              </motion.div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/50 backdrop-blur-sm"
              >
                <div className="text-7xl mb-6 drop-shadow-lg">🏠</div>
                <p className="text-gray-300 text-xl mb-2 font-medium drop-shadow-sm">No properties found matching your criteria</p>
                <p className="text-gray-500 text-sm mb-8">Try adjusting your search filters or browse all available properties</p>
                <button 
                  onClick={() => setFilteredProperties(allProperties)}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 drop-shadow-lg"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}