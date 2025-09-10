"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Plus, Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { properties } from "@/lib/propertyData";

export default function PropertiesManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyList, setPropertyList] = useState(properties);

  const filteredProperties = propertyList.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProperty = (id: string) => {
    setPropertyList(prev => prev.filter(p => p.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "For Sale": "bg-green-500",
      "Sold": "bg-gray-500",
      "Pending": "bg-yellow-500",
      "Draft": "bg-blue-500"
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#000423]">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Properties Management</h1>
            <p className="text-gray-400 mt-2">Manage all property listings and virtual tours</p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/upload')}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-700 text-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')} className="text-white">
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('for sale')} className="text-white">
                    For Sale
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('sold')} className="text-white">
                    Sold
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')} className="text-white">
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Properties ({filteredProperties.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Manage property listings, virtual tours, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Property</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Agent</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-slate-700">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{property.title}</div>
                        <div className="text-sm text-gray-400">
                          {property.bedrooms} bed • {property.bathrooms} bath • {property.square_feet}m²
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{property.location}</TableCell>
                    <TableCell className="text-gray-300">{property.type}</TableCell>
                    <TableCell className="text-white font-medium">
                      ${property.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell className="text-gray-300">{property.agent.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem 
                            onClick={() => router.push(`/property/${property.id}`)}
                            className="text-white"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Property
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}