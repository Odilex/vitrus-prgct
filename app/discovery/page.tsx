"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/property-card";
import PropertySearch from "@/components/property-search";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import { Property } from "@/lib/types/property";
import { PropertyService } from "@/lib/propertyService";
import { ErrorHandler } from "@/lib/errorHandler";

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
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(142,142,157,0.08),transparent)] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.03),transparent)] z-0" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400 leading-tight">
              Discover Virtual Tours
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Featured Properties
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover our handpicked selection of premium properties with virtual tours
              </p>
            </motion.div>
            
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400 text-lg">Loading properties...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-red-900/20 rounded-2xl border border-red-800/50"
              >
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-300 text-xl mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
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
                className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/50"
              >
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-300 text-xl mb-6">No properties found matching your criteria</p>
                <button 
                  onClick={() => setFilteredProperties(allProperties)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors duration-200"
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