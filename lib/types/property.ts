export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'other';
  status: 'active' | 'pending' | 'sold' | 'inactive';
  images: string[];
  features: string[];
  featured?: boolean;
  virtualTourUrl?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  listingDate: string;
  yearBuilt?: number;
  lotSize?: number;
  parkingSpaces?: number;
  hasGarage?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
  owner?: PropertyOwner;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'other';
  status: 'active' | 'pending' | 'sold' | 'inactive';
  images: File[];
  features: string[];
  virtualTourUrl?: string;
  yearBuilt?: number;
  lotSize?: number;
  parkingSpaces?: number;
  hasGarage?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
}

export interface PropertySearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  features?: string[];
}