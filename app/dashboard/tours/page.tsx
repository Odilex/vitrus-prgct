"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { properties } from "@/lib/propertyData";
import { TourService } from "@/lib/api/tour";
import { usePropertyStore } from "@/lib/propertyStore";
import { useClientStore } from "@/lib/clientStore";
import { toast } from "sonner";
import { ErrorHandler } from "@/lib/errorHandler";
import { Tour } from "@/lib/apiService";
import type { DashboardClient } from "@/lib/clientStore";

interface DashboardTour extends Tour {
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  tourType: 'virtual' | 'physical';
}

// Tours data now comes from database via useTourStore

export default function DashboardToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<DashboardTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tours from API
  const loadTours = async () => {
    try {
      setIsLoading(true);
      const toursData = await TourService.getAll();
      // Transform Tour[] to DashboardTour[] by adding required properties
      const dashboardTours: DashboardTour[] = (toursData || []).map(tour => ({
        ...tour,
        propertyTitle: dbProperties.find(p => p.id === tour.propertyId)?.title || 'Unknown Property',
        clientName: clients.find(c => c.id === tour.clientId)?.full_name || 'Unknown Client',
        clientEmail: clients.find(c => c.id === tour.clientId)?.email || '',
        clientPhone: clients.find(c => c.id === tour.clientId)?.phone || '',
        date: new Date(tour.scheduledDate).toISOString().split('T')[0],
        time: new Date(tour.scheduledDate).toTimeString().slice(0, 5),
        tourType: 'physical' as const
      }));
      setTours(dashboardTours);
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to load tours: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);
  const { properties: dbProperties } = usePropertyStore();
  const { clients } = useClientStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<DashboardTour | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    propertyId: '',
    clientId: '',
    date: '',
    time: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      propertyId: '',
      clientId: '',
      date: '',
      time: '',
      notes: ''
    });
    setEditingTour(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const property = dbProperties.find(p => p.id === formData.propertyId) || properties.find(p => p.id === formData.propertyId);
    if (!property) return;

    try {
      if (editingTour) {
        // Update existing tour
        const updatedTour = await TourService.update(editingTour.id, {
          property_id: formData.propertyId,
          client_id: formData.clientId,
          scheduled_date: `${formData.date}T${formData.time}:00`,
          notes: formData.notes,
          status: 'scheduled'
        });
        if (!updatedTour) return;
      } else {
        // Create new tour
        const createdTour = await TourService.create({
          property_id: formData.propertyId,
          client_id: formData.clientId,
          scheduled_date: `${formData.date}T${formData.time}:00`,
          notes: formData.notes,
          status: 'scheduled'
        });
        if (!createdTour) return;
      }

      // Refresh tours list
      await loadTours();

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to save tour: ${errorMessage}`);
    }
  };

  const handleEdit = (tour: DashboardTour) => {
    setEditingTour(tour);
    const scheduledDate = new Date(tour.scheduledDate || tour.createdAt || new Date());
    setFormData({
      propertyId: tour.propertyId,
      clientId: tour.clientId || '',
      date: scheduledDate.toISOString().split('T')[0],
      time: scheduledDate.toTimeString().slice(0, 5),
      notes: tour.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }
    
    try {
      await TourService.delete(tourId);
      // Refresh tours list
      await loadTours();
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to delete tour: ${errorMessage}`);
    }
  };

  const updateTourStatus = async (tourId: string, status: Tour['status']) => {
    try {
      await TourService.update(tourId, { status });
      // Refresh tours list
      await loadTours();
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error);
      toast.error(`Failed to update tour status: ${errorMessage}`);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    const matchesSearch = tour.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: DashboardTour['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-600/20 text-blue-400', icon: Calendar },
      completed: { color: 'bg-green-600/20 text-green-400', icon: CheckCircle },
      cancelled: { color: 'bg-red-600/20 text-red-400', icon: XCircle },
      rescheduled: { color: 'bg-purple-600/20 text-purple-400', icon: Calendar }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tours Management</h1>
              <p className="text-slate-400">Schedule and manage property tours</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTour ? 'Edit Tour' : 'Schedule New Tour'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingTour ? 'Update tour details' : 'Schedule a new property tour for a client'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property" className="text-slate-300">Property</Label>
                    <Select 
                      value={formData.propertyId} 
                      onValueChange={(value) => setFormData({...formData, propertyId: value})}
                      required
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {(dbProperties.length > 0 ? dbProperties : properties).map(property => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  

                </div>

                <div>
                  <Label htmlFor="clientId" className="text-slate-300">Client</Label>
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(value) => setFormData({...formData, clientId: value})}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.full_name} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-slate-300">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="text-slate-300">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-slate-300">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="bg-slate-800 border-slate-700"
                    rows={3}
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                    {editingTour ? 'Update Tour' : 'Schedule Tour'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by client name or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tours Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Scheduled Tours</CardTitle>
            <CardDescription className="text-slate-400">
              Manage all property tours and appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Client</TableHead>
                  <TableHead className="text-slate-300">Property</TableHead>
                  <TableHead className="text-slate-300">Date & Time</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour.id} className="border-slate-800">
                    <TableCell>
                      {(() => {
                        const client = clients.find(c => c.id === tour.clientId);
                        return (
                          <div>
                            <div className="text-white font-medium">{client?.full_name || 'Unknown Client'}</div>
                            <div className="text-slate-400 text-sm">{client?.email || ''}</div>
                            <div className="text-slate-400 text-sm">{client?.phone || ''}</div>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const property = dbProperties.find(p => p.id === tour.propertyId);
                        return <div className="text-white">{property?.title || 'Unknown Property'}</div>;
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const scheduledDate = new Date(tour.scheduledDate);
                        return (
                          <div>
                            <div className="text-white">{scheduledDate.toLocaleDateString()}</div>
                            <div className="text-slate-400 text-sm">{scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </div>
                        );
                      })()}
                    </TableCell>
                     <TableCell>
                      {getStatusBadge(tour.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {tour.status === 'scheduled' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateTourStatus(tour.id, 'scheduled')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTourStatus(tour.id, 'cancelled')}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {tour.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => updateTourStatus(tour.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(tour)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(tour.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredTours.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No tours found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}