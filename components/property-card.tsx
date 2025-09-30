"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Bed, Bath, Square, ImageIcon } from "lucide-react";
import { Property } from "@/lib/types/property";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageWithFallback, getDefaultImage, isImageUrlSafe } from "@/lib/imageUtils";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  
  // Get safe image URL with validation
  const getSafeImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || !isImageUrlSafe(imageUrl)) {
      return getDefaultImage('property');
    }
    return getImageWithFallback(imageUrl, 'property');
  };
  
  const [imageSrc, setImageSrc] = useState(getSafeImageUrl(property.images?.[0]));
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleClick = () => {
    router.push(`/property/${property.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    setImageSrc(getDefaultImage('property'));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-700 rounded-lg flex items-center justify-center animate-pulse">
                  <ImageIcon className="h-8 w-8 text-slate-500" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-700 rounded w-24 mx-auto animate-pulse"></div>
                  <div className="h-2 bg-slate-700 rounded w-16 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <div className="w-16 h-16 mx-auto mb-3 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
                <ImageIcon className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-sm font-medium">Image unavailable</p>
              <p className="text-xs text-slate-500 mt-1">Using default placeholder</p>
            </div>
          </div>
        )}
        
        <Image
          src={imageSrc}
          alt={property.title || 'Property image'}
          width={400}
          height={250}
          className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {property.featured && (
          <Badge className="absolute top-3 left-3 bg-cyan-500 hover:bg-cyan-600">
            Featured
          </Badge>
        )}
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-slate-800/80 text-white"
        >
          {property.status}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
              {property.title}
            </CardTitle>
            <CardDescription className="text-slate-400 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.city}, {property.state}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">
              ${property.price?.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">{property.propertyType}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-slate-400 text-sm">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} beds
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} baths
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.squareFootage}m²
          </div>
        </div>
        
        {property.features && property.features.length > 0 && (
          <div className="flex gap-2 mb-4">
            {property.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-slate-700 text-slate-300"
              >
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs border-slate-700 text-slate-300"
              >
                +{property.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Virtual Tour
        </Button>
      </CardContent>
    </Card>
  );
}