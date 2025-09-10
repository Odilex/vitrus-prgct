"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, ImageIcon, Video, ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { propertyService } from "@/lib/api/property";
import type { Property } from "@/lib/types/property";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  images: string[];
  tourUrl: string;
  amenities: string;
  status: string;
  owner: string;
  ownerContact: string;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  // Remove property store usage
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    images: [],
    tourUrl: "",
    amenities: "",
    status: "Active",
    owner: "",
    ownerContact: ""
  });

  const propertyTypes = [
    "Villa",
    "Apartment",
    "House",
    "Penthouse",
    "Studio"
  ];

  const locations = [
    "Kigali",
    "Musanze",
    "Rubavu",
    "Huye",
    "Muhanga",
    "Nyagatare"
  ];

  const statusOptions = [
    "Active",
    "Inactive",
    "Sold",
    "Rented"
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        try {
          setIsLoading(true);
          const foundProperty = await propertyService.getById(propertyId);
          setProperty(foundProperty);
          setFormData({
            title: foundProperty.title,
            description: foundProperty.description,
            price: foundProperty.price.toString(),
            location: `${foundProperty.address}, ${foundProperty.city}, ${foundProperty.state}`,
            type: foundProperty.propertyType,
            bedrooms: foundProperty.bedrooms.toString(),
            bathrooms: foundProperty.bathrooms.toString(),
            squareFeet: foundProperty.squareFootage.toString(),
            images: foundProperty.images || [],
            tourUrl: foundProperty.virtualTourUrl || "",
            amenities: foundProperty.features?.join(", ") || "",
            status: foundProperty.status || "active",
            owner: "",
            ownerContact: ""
          });
        } catch (error) {
          console.error('Error fetching property:', error);
          toast.error("Property not found");
          router.push("/dashboard/properties");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProperty();
  }, [propertyId, router]);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - use local default images to avoid CORS/ORB issues
      const imageUrls = Array.from(files).map((file, index) => 
        `/images/default-property.jpg`
      );
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.price || !formData.location || !formData.type) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Parse location back to address components
      const locationParts = formData.location.split(", ");
      
      // Update property data
      const updatedPropertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        address: locationParts[0] || formData.location,
        city: locationParts[1] || "",
        state: locationParts[2] || "",
        propertyType: formData.type as any,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFeet) || 0,
        images: formData.images,
        virtualTourUrl: formData.tourUrl || undefined,
        features: formData.amenities.split(",").map(a => a.trim()).filter(a => a),
        status: formData.status as any
      };

      // Update property via API
      await propertyService.update(propertyId, updatedPropertyData);
      
      toast.success("Property updated successfully!");
      router.push("/dashboard/properties");
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to delete property
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Delete property using the property store
      propertyStore.deleteProperties([propertyId]);
      
      toast.success("Property deleted successfully!");
      router.push("/dashboard/properties");
    } catch (error) {
      toast.error("Failed to delete property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading property...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Edit Property</h1>
            <Badge variant="secondary" className="bg-cyan-600 text-white">
              ID: {propertyId}
            </Badge>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter property title"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-slate-300">Price (RWF) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="Enter price"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type" className="text-slate-300">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-slate-300">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {locations.map((location) => (
                        <SelectItem key={location} value={location} className="text-white hover:bg-slate-700">
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-white hover:bg-slate-700">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter property description"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms" className="text-slate-300">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    placeholder="Number of bedrooms"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms" className="text-slate-300">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    placeholder="Number of bathrooms"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="squareFeet" className="text-slate-300">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    value={formData.squareFeet}
                    onChange={(e) => handleInputChange("squareFeet", e.target.value)}
                    placeholder="Property size"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amenities" className="text-slate-300">Amenities</Label>
                <Textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange("amenities", e.target.value)}
                  placeholder="List property amenities (comma-separated)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Management */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Media Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Images */}
              {formData.images.length > 0 && (
                <div>
                  <Label className="text-slate-300">Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div>
                <Label htmlFor="images" className="text-slate-300">Add More Images</Label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("images")?.click()}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="tourUrl" className="text-slate-300 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Virtual Tour URL
                </Label>
                <Input
                  id="tourUrl"
                  value={formData.tourUrl}
                  onChange={(e) => handleInputChange("tourUrl", e.target.value)}
                  placeholder="Enter virtual tour URL (YouTube, Vimeo, etc.)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Property
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}