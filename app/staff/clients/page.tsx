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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Plus, Edit, Eye, Trash2, MoreHorizontal, Mail, Phone, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock client data
const mockClients = [
  {
    id: "client-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+250 781234567",
    status: "active",
    joinDate: "2023-01-15",
    propertiesViewed: 5,
    toursBooked: 3,
    lastActivity: "2023-06-18",
    notes: "Interested in luxury properties in Kigali",
    preferredContact: "email"
  },
  {
    id: "client-002",
    name: "Alice Smith",
    email: "alice.smith@email.com",
    phone: "+250 782345678",
    status: "active",
    joinDate: "2023-02-20",
    propertiesViewed: 8,
    toursBooked: 2,
    lastActivity: "2023-06-17",
    notes: "Looking for family homes in quiet neighborhoods",
    preferredContact: "phone"
  },
  {
    id: "client-003",
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    phone: "+250 783456789",
    status: "inactive",
    joinDate: "2023-03-10",
    propertiesViewed: 2,
    toursBooked: 1,
    lastActivity: "2023-05-15",
    notes: "Commercial property investor",
    preferredContact: "email"
  },
  {
    id: "client-004",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+250 784567890",
    status: "active",
    joinDate: "2023-04-05",
    propertiesViewed: 12,
    toursBooked: 7,
    lastActivity: "2023-06-19",
    notes: "First-time buyer, needs guidance",
    preferredContact: "phone"
  },
  {
    id: "client-005",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+250 785678901",
    status: "lead",
    joinDate: "2023-06-01",
    propertiesViewed: 1,
    toursBooked: 0,
    lastActivity: "2023-06-19",
    notes: "Relocating from abroad, high budget",
    preferredContact: "email"
  }
];

export default function ClientsManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clients, setClients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "active": "bg-green-500",
      "inactive": "bg-gray-500",
      "lead": "bg-blue-500",
      "blocked": "bg-red-500"
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const openClientDetails = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#000423]">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Clients Management</h1>
            <p className="text-gray-400 mt-2">Manage client relationships and track engagement</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-cyan-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Clients</p>
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Active Clients</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">New Leads</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.filter(c => c.status === 'lead').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.reduce((sum, c) => sum + c.propertiesViewed, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clients..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter('active')} className="text-white">
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')} className="text-white">
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('lead')} className="text-white">
                    Leads
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">All Clients ({filteredClients.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Manage client information and track their engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Properties Viewed</TableHead>
                  <TableHead className="text-gray-300">Tours Booked</TableHead>
                  <TableHead className="text-gray-300">Last Activity</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-slate-700">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-400">Joined {client.joinDate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-white">{client.propertiesViewed}</TableCell>
                    <TableCell className="text-white">{client.toursBooked}</TableCell>
                    <TableCell className="text-gray-300">{client.lastActivity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem 
                            onClick={() => openClientDetails(client)}
                            className="text-white"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client.id)}
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

        {/* Client Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Detailed information about {selectedClient?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedClient && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Name</Label>
                    <p className="text-white font-medium">{selectedClient.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <p className="text-white">{selectedClient.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Phone</Label>
                    <p className="text-white">{selectedClient.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Properties Viewed</Label>
                    <p className="text-white font-medium">{selectedClient.propertiesViewed}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Tours Booked</Label>
                    <p className="text-white font-medium">{selectedClient.toursBooked}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Join Date</Label>
                    <p className="text-white">{selectedClient.joinDate}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Notes</Label>
                  <p className="text-white mt-1">{selectedClient.notes}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-white"
              >
                Close
              </Button>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                Edit Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}