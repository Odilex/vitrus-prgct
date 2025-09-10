"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, ImageIcon, Video, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import PropertyService from '@/lib/api/property';
import { getPropertyImagePlaceholder } from "@/lib/imageUtils";
import UploadService from '@/lib/api/upload';

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
  owner: string;
  ownerContact: string;
}

export default function UploadPropertyPage() {
  const router = useRouter();

   const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
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

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    toast.success('Image removed successfully');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    
    try {
      const fileArray = Array.from(files);
      
      // Validate files
      for (const file of fileArray) {
        const validation = UploadService.validateImageFile(file);
        if (!validation.valid) {
          toast.error(`Invalid file ${file.name}: ${validation.error}`);
          setUploadingImages(false);
          return;
        }
      }

      // Upload files
      const uploadResults = await UploadService.uploadMultipleImages(fileArray);
      
      const successfulUploads: string[] = [];
      const failedUploads: string[] = [];
      
      uploadResults.forEach((result, index) => {
        if (result.success && result.url) {
          successfulUploads.push(result.url);
        } else {
          failedUploads.push(fileArray[index].name);
          console.error(`Upload failed for ${fileArray[index].name}:`, result.error);
        }
      });
      
      if (successfulUploads.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...successfulUploads]
        }));
        toast.success(`Successfully uploaded ${successfulUploads.length} image(s)`);
      }
      
      if (failedUploads.length > 0) {
        toast.error(`Failed to upload: ${failedUploads.join(', ')}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Clear the input
      e.target.value = '';
    }
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
      
      // Create new property data matching Property interface
      const newPropertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        address: formData.location,
        city: formData.location, // Use location as city for now
        state: "",
        zipCode: "",
        propertyType: formData.type.toLowerCase() as 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa' | 'other',
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFeet) || 0,
        images: formData.images.length > 0 ? formData.images : [getPropertyImagePlaceholder(formData.type)],
        features: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
        virtualTourUrl: formData.tourUrl || undefined,
        status: "active" as 'active' | 'pending' | 'sold' | 'inactive',
        listingDate: new Date().toISOString()
      };

      // Add property to the database via API
      const createdProperty = await PropertyService.create(newPropertyData);
      
      if (createdProperty) {
        toast.success("Property uploaded successfully!");
        router.push("/dashboard/properties");
      } else {
        toast.error("Failed to upload property. Please try again.");
      }
    } catch (error: any) {
      console.error('Error uploading property:', error);
      
      // Parse error message for better user feedback
      let errorMessage = 'Failed to upload property. Please try again.';
      
      if (error.message) {
        if (error.message.includes('HTTP error! status: 400')) {
          errorMessage = 'Please check your input data - some fields may be invalid';
        } else if (error.message.includes('HTTP error! status: 401')) {
          errorMessage = 'Authentication required. Please log in again';
        } else if (error.message.includes('HTTP error! status: 403')) {
          errorMessage = 'You do not have permission to create properties';
        } else if (error.message.includes('HTTP error! status: 500')) {
          errorMessage = 'Server error. Please try again later';
        } else if (error.message.includes('Authentication required')) {
          errorMessage = 'Please log in to upload properties';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show specific validation errors if available
      if (error?.details && Array.isArray(error.details)) {
        const validationErrors = error.details.map((detail: any) => detail.msg || detail.message).join(', ');
        errorMessage = `Validation errors: ${validationErrors}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Upload New Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner" className="text-slate-300">Property Owner *</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => handleInputChange("owner", e.target.value)}
                    placeholder="Enter property owner name"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownerContact" className="text-slate-300">Owner Contact *</Label>
                  <Input
                    id="ownerContact"
                    value={formData.ownerContact}
                    onChange={(e) => handleInputChange("ownerContact", e.target.value)}
                    placeholder="Enter contact (phone/email)"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
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
                  placeholder="List property amenities (e.g., Pool, Gym, Parking)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Media Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images" className="text-slate-300">Property Images</Label>
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
                    disabled={uploadingImages}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {uploadingImages ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300 mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                      </>
                    )}
                  </Button>
                  <p className="text-slate-400 text-sm mt-2">
                    Upload multiple images of your property
                  </p>
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-slate-300 mb-2">Uploaded Images ({formData.images.length}):</p>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                                            alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded border border-slate-700"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getPropertyImagePlaceholder();
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

          {/* Submit Button */}
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
              disabled={isLoading || uploadingImages}
              className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Property...
                </>
              ) : uploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading Images...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Upload Property
                </>
              )}
            </Button>
          </div>
        </form>
        </div>
    </div>
  );
}