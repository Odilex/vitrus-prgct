"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building, Upload, Settings, Eye, BarChart3 } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/lib/api/property";
import { Property } from "@/lib/types/property";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch real properties from database
        const fetchedProperties = await propertyService.getAll();
        setProperties(fetchedProperties);
        
        // Calculate real statistics
        const totalViews = fetchedProperties.reduce((sum, p) => sum + (p.views || 0), 0);
        const activeListings = fetchedProperties.filter(p => p.status === 'active').length;
        
        setStats({
          totalProperties: fetchedProperties.length,
          activeListings,
          totalViews,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
        setIsLoading(false);
        // Redirect to login page in case of auth failure
        // router.push("/login");
      }
    };

    loadDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-slate-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-slate-200 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <DashboardSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => router.push('/dashboard/upload')} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" /> Upload New Property
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200">Total Properties</CardTitle>
              <CardDescription className="text-slate-400">Your property portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-500 mr-3" />
                <div className="text-3xl font-bold">{stats.totalProperties}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200">Active Listings</CardTitle>
              <CardDescription className="text-slate-400">Properties available for tour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-8 w-8 text-green-500 mr-3" />
                <div className="text-3xl font-bold">{stats.activeListings}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-200">Total Views</CardTitle>
              <CardDescription className="text-slate-400">Property engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-500 mr-3" />
                <div className="text-3xl font-bold">{stats.totalViews}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="bg-slate-900 border-slate-800">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200">Your Properties</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-slate-400">Name</th>
                        <th className="text-left py-3 px-4 text-slate-400">Address</th>
                        <th className="text-left py-3 px-4 text-slate-400">Price</th>
                        <th className="text-left py-3 px-4 text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 text-slate-400">Views</th>
                        <th className="text-right py-3 px-4 text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4">{property.title}</td>
                          <td className="py-3 px-4">{property.address}</td>
                          <td className="py-3 px-4">${property.price.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              property.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {property.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{property.views || 0}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-slate-400 hover:text-slate-100 mr-1"
                              onClick={() => router.push(`/property/${property.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-slate-400 hover:text-slate-100"
                              onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200">Property Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  View engagement metrics for your properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-700 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Analytics visualization will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}