"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home } from "lucide-react";

interface PropertySearchProps {
  onSearch: (query: string, type: string, location: string) => void;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery, propertyType, location);
  };

  const handleReset = () => {
    setSearchQuery("");
    setPropertyType("");
    setLocation("");
    onSearch("", "", "");
  };

  const propertyTypes = [
    "All Types",
    "Villa",
    "Apartment",
    "House",
    "Penthouse",
    "Studio"
  ];

  const locations = [
    "All Locations",
    "Kigali",
    "Musanze",
    "Rubavu",
    "Huye",
    "Muhanga",
    "Nyagatare"
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Property Type Select */}
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="pl-10 bg-slate-800 border-slate-700 text-white focus:border-cyan-500">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="pl-10 bg-slate-800 border-slate-700 text-white focus:border-cyan-500">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {locations.map((loc) => (
                  <SelectItem 
                    key={loc} 
                    value={loc}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}