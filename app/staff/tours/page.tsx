"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, Filter, Search, X } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import StaffSidebar from "@/components/staff/sidebar";

// Tour data interfaces
interface Tour {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestDate: string;
  tourDate: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes: string;
  assignedTo: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface ToursData {
  tours: Tour[];
  staff: Staff[];
}

// Tours service for API integration
class ToursService {
  private static readonly BASE_URL = '/api/v1/tours';

  static async getToursData(): Promise<ToursData> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tours data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tours data:', error);
      // Return default data structure
      return {
        tours: [],
        staff: []
      };
    }
  }

  static async updateTourStatus(tourId: string, status: string): Promise<Tour | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/${tourId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update tour status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating tour status:', error);
      return null;
    }
  }

  static async assignTour(tourId: string, staffId: string): Promise<Tour | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/${tourId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ staffId })
      });

      if (!response.ok) {
        throw new Error('Failed to assign tour');
      }

      return await response.json();
    } catch (error) {
      console.error('Error assigning tour:', error);
      return null;
    }
  }
}

export default function ToursManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [tours, setTours] = useState<Tour[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [viewTourDetails, setViewTourDetails] = useState<Tour | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [tourToAssign, setTourToAssign] = useState<Tour | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToursData = async () => {
      try {
        setLoading(true);
        const data = await ToursService.getToursData();
        setTours(data.tours);
        setStaff(data.staff);
        setError(null);
      } catch (err) {
        setError('Failed to load tours data');
        console.error('Error loading tours data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadToursData();
  }, []);

  // Filter tours based on search query and selected tab
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.clientPhone.includes(searchQuery);

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && tour.status === selectedTab;
  });

  // Handle tour status change
  const handleStatusChange = async (tourId: string, newStatus: string) => {
    try {
      const updatedTour = await ToursService.updateTourStatus(tourId, newStatus);
      if (updatedTour) {
        setTours(
          tours.map((tour) =>
            tour.id === tourId ? { ...tour, status: newStatus as Tour['status'] } : tour
          )
        );
        toast.success(`Tour status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update tour status');
      }
    } catch (error) {
      toast.error('Failed to update tour status');
      console.error('Error updating tour status:', error);
    }
  };

  // Handle tour assignment
  const handleAssignTour = async () => {
    if (!selectedStaff || !tourToAssign) return;
    
    try {
      const updatedTour = await ToursService.assignTour(tourToAssign.id, selectedStaff);
      if (updatedTour) {
        const staffMember = staff.find(s => s.id === selectedStaff);
        
        setTours(
          tours.map((tour) =>
            tour.id === tourToAssign.id 
              ? { ...tour, assignedTo: staffMember?.name || "Unassigned" } 
              : tour
          )
        );
        
        toast.success(`Tour successfully assigned to ${staffMember?.name}`);
        setAssignDialogOpen(false);
        setTourToAssign(null);
        setSelectedStaff(null);
      } else {
        toast.error('Failed to assign tour');
      }
    } catch (error) {
      toast.error('Failed to assign tour');
      console.error('Error assigning tour:', error);
    }
  };

  // Handle tour deletion
  const handleDeleteTour = () => {
    if (tourToDelete) {
      setTours(tours.filter((tour) => tour.id !== tourToDelete));
      setDeleteConfirmOpen(false);
      setTourToDelete(null);
      toast.success("Tour deleted successfully");
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <StaffSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading tours data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <StaffSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Count tours by status
  const tourCounts = {
    all: tours.length,
    pending: tours.filter((tour) => tour.status === "pending").length,
    approved: tours.filter((tour) => tour.status === "approved").length,
    completed: tours.filter((tour) => tour.status === "completed").length,
    cancelled: tours.filter((tour) => tour.status === "cancelled").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <StaffSidebar />
      <div className="flex-1 p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tours Management</h1>
            <Button onClick={() => router.push("/staff/tours/create")}>
              Create New Tour
            </Button>
          </div>

          {/* Tour Statistics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tourCounts.all}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tourCounts.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tourCounts.approved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tourCounts.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search tours..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedTab("all")}>
                    All Tours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab("pending")}>
                    Pending Tours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab("approved")}>
                    Approved Tours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab("completed")}>
                    Completed Tours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTab("cancelled")}>
                    Cancelled Tours
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTab("all");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Tours Tabs */}
          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({tourCounts.all})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({tourCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({tourCounts.approved})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({tourCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({tourCounts.cancelled})
              </TabsTrigger>
            </TabsList>
            <TabsContent value={selectedTab} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tours</CardTitle>
                  <CardDescription>
                    Manage property tour requests and appointments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Tour Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTours.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No tours found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTours.map((tour) => (
                          <TableRow key={tour.id}>
                            <TableCell className="font-medium">
                              {tour.propertyName}
                            </TableCell>
                            <TableCell>{tour.clientName}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                {format(new Date(tour.tourDate), "MMM dd, yyyy")}
                                <Clock className="ml-4 mr-2 h-4 w-4 text-gray-500" />
                                {format(new Date(tour.tourDate), "h:mm a")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  tour.status === "pending"
                                    ? "outline"
                                    : tour.status === "approved"
                                    ? "default"
                                    : tour.status === "completed"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {tour.assignedTo === "Unassigned" ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Unassigned
                                </Badge>
                              ) : (
                                tour.assignedTo
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setViewTourDetails(tour)}
                                >
                                  View
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setTourToAssign(tour);
                                        setAssignDialogOpen(true);
                                      }}
                                    >
                                      Assign Staff
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(tour.id, "pending")}
                                      disabled={tour.status === "pending"}
                                    >
                                      Mark as Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(tour.id, "approved")}
                                      disabled={tour.status === "approved"}
                                    >
                                      Approve Tour
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(tour.id, "completed")}
                                      disabled={tour.status === "completed"}
                                    >
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(tour.id, "cancelled")}
                                      disabled={tour.status === "cancelled"}
                                    >
                                      Cancel Tour
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        setTourToDelete(tour.id);
                                        setDeleteConfirmOpen(true);
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tour Details Dialog */}
        {viewTourDetails && (
          <Dialog open={!!viewTourDetails} onOpenChange={() => setViewTourDetails(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tour Details</DialogTitle>
                <DialogDescription>
                  Complete information about the selected tour.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Property</h3>
                    <p className="mt-1">{viewTourDetails.propertyName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Property ID</h3>
                    <p className="mt-1">{viewTourDetails.propertyId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Client Name</h3>
                    <p className="mt-1">{viewTourDetails.clientName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Client Contact</h3>
                    <p className="mt-1">{viewTourDetails.clientEmail}</p>
                    <p>{viewTourDetails.clientPhone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Request Date</h3>
                    <p className="mt-1">
                      {format(new Date(viewTourDetails.requestDate), "MMM dd, yyyy")} at{" "}
                      {format(new Date(viewTourDetails.requestDate), "h:mm a")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Tour Date</h3>
                    <p className="mt-1">
                      {format(new Date(viewTourDetails.tourDate), "MMM dd, yyyy")} at{" "}
                      {format(new Date(viewTourDetails.tourDate), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Status</h3>
                    <p className="mt-1">
                      <Badge
                        variant={
                          viewTourDetails.status === "pending"
                            ? "outline"
                            : viewTourDetails.status === "approved"
                            ? "default"
                            : viewTourDetails.status === "completed"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {viewTourDetails.status.charAt(0).toUpperCase() + viewTourDetails.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Assigned To</h3>
                    <p className="mt-1">{viewTourDetails.assignedTo}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Notes</h3>
                  <p className="mt-1">{viewTourDetails.notes}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewTourDetails(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setViewTourDetails(null);
                  router.push(`/staff/tours/edit/${viewTourDetails.id}`);
                }}>
                  Edit Tour
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this tour? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteTour}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Staff Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Staff Member</DialogTitle>
              <DialogDescription>
                Select a staff member to assign to this tour.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {staff.map((staffMember) => (
                <div
                  key={staffMember.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                    selectedStaff === staffMember.id
                      ? "bg-primary/10 border border-primary"
                      : "border"
                  }`}
                  onClick={() => setSelectedStaff(staffMember.id)}
                >
                  <div>
                    <p className="font-medium">{staffMember.name}</p>
                    <p className="text-sm text-gray-500">{staffMember.role}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      selectedStaff === staffMember.id
                        ? "bg-primary"
                        : "border border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAssignDialogOpen(false);
                setSelectedStaff(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAssignStaff} disabled={!selectedStaff}>
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}