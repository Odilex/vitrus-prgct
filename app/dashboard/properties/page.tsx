"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Eye, Trash2, Filter, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { usePropertyStore } from "@/lib/propertyStore";
import { PropertyErrorBoundary, PropertyErrorInline } from "@/components/ui/property-error-boundary";
import { PropertyService } from "@/lib/propertyService";
import { ErrorHandler } from "@/lib/errorHandler";
import type { Property } from "@/lib/types/property";
import RealTimePropertyUpdates from "@/components/ui/real-time-property-updates";
import RealTimeDemo from "@/components/ui/real-time-demo";

interface PropertyStats {
  total: number;
  active: number;
  inactive: number;
  sold: number;
  rented: number;
  totalValue: number;
  averagePrice: number;
}

export default function PropertiesManagementPage() {
  const router = useRouter();
  const { 
    properties, 
    isLoading, 
    error, 
    retryLastOperation, 
    clearError, 
    refreshProperties 
  } = usePropertyStore();
  
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  
  // Load properties using PropertyService
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoadingProperties(true);
        setPropertiesError(null);
        
        const result = await PropertyService.getAll();
        if (result) {
          setPropertiesData(result);
        } else {
          throw new Error('Failed to load properties');
        }
      } catch (error) {
        const errorMessage = ErrorHandler.handle(error);
        setPropertiesError(errorMessage);
        toast.error(`Failed to load properties: ${errorMessage}`);
      } finally {
        setLoadingProperties(false);
      }
    };
    
    loadProperties();
  }, []);
  
  // Use enhanced properties data for stats
  const currentProperties = propertiesData.length > 0 ? propertiesData : properties;
  const stats = {
    total: currentProperties.length,
    active: currentProperties.filter(p => p.status === 'active').length,
    pending: currentProperties.filter(p => p.status === 'pending').length,
    sold: currentProperties.filter(p => p.status === 'sold').length,
    totalValue: currentProperties.reduce((sum, p) => sum + (p.price || 0), 0),
    averagePrice: currentProperties.length > 0 ? currentProperties.reduce((sum, p) => sum + (p.price || 0), 0) / currentProperties.length : 0
  };
  
  // Handle manual refresh with enhanced error handling
  const handleRefresh = async () => {
    try {
      setLoadingProperties(true);
      setPropertiesError(null);
      
      const result = await PropertyService.getAll();
      if (result) {
        setPropertiesData(result);
        toast.success('Properties refreshed successfully');
      } else {
        throw new Error('Failed to refresh properties');
      }
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      setPropertiesError(errorMessage);
      toast.error(`Failed to refresh properties: ${errorMessage}`);
    } finally {
      setLoadingProperties(false);
    }
  };
  
  // Filter properties based on current filters
  const filteredProperties = currentProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter;
    const matchesLocation = locationFilter === 'all' || 
                           property.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           property.state.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });
  
  const handleSelectProperty = (propertyId: string) => {
    const newSelected = selectedProperties.includes(propertyId) 
      ? selectedProperties.filter(id => id !== propertyId)
      : [...selectedProperties, propertyId];
    setSelectedProperties(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };
  
  const handleBulkAction = async (action: string) => {
    if (selectedProperties.length === 0) {
      toast.error("Please select properties first");
      return;
    }
    
    try {
      switch (action) {
        case "delete":
          if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties?`)) {
            const results = await Promise.all(
                selectedProperties.map(id => PropertyService.delete(id))
              );
              
              const failedDeletes = results.filter((r: boolean) => !r);
            if (failedDeletes.length > 0) {
              toast.error(`Failed to delete ${failedDeletes.length} properties`);
            } else {
              setPropertiesData(prev => prev.filter(p => !selectedProperties.includes(p.id)));
              setSelectedProperties([]);
              toast.success(`${selectedProperties.length} properties deleted`);
            }
          }
          break;
        case "activate":
          const activateResults = await Promise.all(
              selectedProperties.map(id => 
                PropertyService.update(id, { status: 'active' })
              )
            );
            
            const failedActivates = activateResults.filter((r: Property | null) => !r);
          if (failedActivates.length > 0) {
            toast.error(`Failed to activate ${failedActivates.length} properties`);
          } else {
            setPropertiesData(prev => prev.map(p => 
              selectedProperties.includes(p.id) ? { ...p, status: 'active' as const } : p
            ));
            setSelectedProperties([]);
            toast.success(`${selectedProperties.length} properties activated`);
          }
          break;
        case "deactivate":
          const deactivateResults = await Promise.all(
              selectedProperties.map(id => 
                PropertyService.update(id, { status: 'inactive' })
              )
            );
            
            const failedDeactivates = deactivateResults.filter((r: Property | null) => !r);
          if (failedDeactivates.length > 0) {
            toast.error(`Failed to deactivate ${failedDeactivates.length} properties`);
          } else {
            setPropertiesData(prev => prev.map(p => 
              selectedProperties.includes(p.id) ? { ...p, status: 'inactive' as const } : p
            ));
            setSelectedProperties([]);
            toast.success(`${selectedProperties.length} properties deactivated`);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to perform bulk action: ${errorMessage}`);
    }
  };
  
  const deleteProperties = async (propertyIds: string[]) => {
    try {
      const results = await Promise.all(
        propertyIds.map(id => PropertyService.delete(id))
      );
      
      const failedDeletes = results.filter((r: boolean) => !r);
      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} properties`);
      }
      
      setPropertiesData(prev => prev.filter(p => !propertyIds.includes(p.id)));
      setSelectedProperties(prev => prev.filter(id => !propertyIds.includes(id)));
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to delete properties: ${errorMessage}`);
      throw error;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      "active": "bg-green-600",
      "inactive": "bg-gray-600",
      "sold": "bg-blue-600",
      "rented": "bg-purple-600",
      "pending": "bg-yellow-600"
    };
    
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'bg-gray-600'} text-white`}>
        {displayStatus}
      </Badge>
    );
  };
  
  const propertyTypes = [...new Set(currentProperties.map(p => p.propertyType))];
  const locations = [...new Set(currentProperties.map(p => `${p.city}, ${p.state}`))];
  
  // Show error boundary if there's an error and no cached data
  if (propertiesError && !loadingProperties && currentProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Property Management</h1>
              <p className="text-slate-400">Manage your property listings and track performance</p>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Error Loading Properties
              </h2>
              <p className="text-slate-300 mb-6">{propertiesError}</p>
              <div className="space-x-4">
                <Button
                  onClick={handleRefresh}
                  className="bg-cyan-600 hover:bg-cyan-700"
                  disabled={loadingProperties}
                >
                  {loadingProperties ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Show inline error if there's an error but we have cached data */}
        {propertiesError && currentProperties.length > 0 && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-red-400">⚠️</div>
                <div>
                  <h3 className="text-red-400 font-medium">Error Loading Latest Data</h3>
                  <p className="text-red-300 text-sm">{propertiesError}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={loadingProperties}
                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                >
                  {loadingProperties ? 'Retrying...' : 'Retry'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPropertiesError(null)}
                  className="text-red-400 hover:bg-red-900/20"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Property Management</h1>
            <p className="text-slate-400">Manage your property listings and track performance</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loadingProperties}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              {loadingProperties ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/dashboard/upload")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Properties</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-cyan-600 p-3 rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Listings</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <div className="bg-green-600 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('en-RW', {
                      style: 'currency',
                      currency: 'RWF',
                      minimumFractionDigits: 0
                    }).format(stats.totalValue)}
                  </p>
                </div>
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg. Price</p>
                  <p className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('en-RW', {
                      style: 'currency',
                      currency: 'RWF',
                      minimumFractionDigits: 0
                    }).format(stats.averagePrice)}
                  </p>
                </div>
                <div className="bg-purple-600 p-3 rounded-lg">
                  <Filter className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Real-time Property Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RealTimeDemo className="h-fit" />
          </div>
          <div>
            <RealTimePropertyUpdates className="h-fit" maxUpdates={10} />
          </div>
        </div>
        
        {/* Filters and Search */}
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Types</SelectItem>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location} className="text-white hover:bg-slate-700">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="newest" className="text-white hover:bg-slate-700">Newest First</SelectItem>
                  <SelectItem value="price-high" className="text-white hover:bg-slate-700">Price: High to Low</SelectItem>
                  <SelectItem value="price-low" className="text-white hover:bg-slate-700">Price: Low to High</SelectItem>
                  <SelectItem value="title" className="text-white hover:bg-slate-700">Title A-Z</SelectItem>
                  <SelectItem value="location" className="text-white hover:bg-slate-700">Location A-Z</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Bulk Actions */}
              {selectedProperties.length > 0 && (
                <Select onValueChange={handleBulkAction}>
                  <SelectTrigger className="bg-cyan-600 border-cyan-600 text-white">
                    <SelectValue placeholder={`Actions (${selectedProperties.length})`} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="activate" className="text-white hover:bg-slate-700">Activate Selected</SelectItem>
                    <SelectItem value="deactivate" className="text-white hover:bg-slate-700">Deactivate Selected</SelectItem>
                    <SelectItem value="delete" className="text-red-400 hover:bg-slate-700">Delete Selected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Properties Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Properties ({filteredProperties.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {selectedProperties.length === filteredProperties.length ? "Deselect All" : "Select All"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Select</TableHead>
                    <TableHead className="text-slate-300">Property</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Price</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Views</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property, index) => (
                    <TableRow key={property.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => handleSelectProperty(property.id)}
                          className="rounded border-slate-600 bg-slate-800 text-cyan-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={property.images?.[0] || '/placeholder.jpg'}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium">{property.title}</p>
                            <p className="text-slate-400 text-sm">{property.bedrooms} bed • {property.bathrooms} bath</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{property.propertyType}</TableCell>
                      <TableCell className="text-slate-300">{`${property.address}, ${property.city}, ${property.state}`}</TableCell>
                      <TableCell className="text-white font-medium">
                        ${property.price?.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell className="text-slate-300">{property.views || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/property/${property.id}`)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (confirm("Are you sure you want to delete this property?")) {
                                try {
                                  await deleteProperties([property.id]);
                                  toast.success("Property deleted successfully");
                                } catch (error) {
                                  console.error('Delete error:', error);
                                  toast.error("Failed to delete property");
                                }
                              }
                            }}
                            className="border-red-700 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">No properties found</p>
                  <p className="text-sm">Try adjusting your search criteria or add a new property</p>
                </div>
                <Button
                  onClick={() => router.push("/dashboard/upload")}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}