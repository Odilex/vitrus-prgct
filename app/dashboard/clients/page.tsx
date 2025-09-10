"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientService from "@/lib/api/client";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Building,
  Users,
  Star,
  Calendar,
  DollarSign,
  Home
} from "lucide-react";
import { properties } from "@/lib/propertyData";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'owner' | 'buyer' | 'tenant';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalProperties: number;
  totalValue: number;
  rating: number;
  notes?: string;
  lastContact: string;
}

interface PropertyOwnership {
  clientId: string;
  propertyId: string;
  propertyTitle: string;
  ownershipType: 'full' | 'partial';
  percentage: number;
  acquisitionDate: string;
  currentValue: number;
}

// Mock clients data will be replaced by database data

// Mock property ownership data
const mockOwnerships: PropertyOwnership[] = [
  {
    clientId: '1',
    propertyId: '1',
    propertyTitle: 'Modern Luxury Villa in Beverly Hills',
    ownershipType: 'full',
    percentage: 100,
    acquisitionDate: '2023-07-01',
    currentValue: 2500000
  },
  {
    clientId: '1',
    propertyId: '4',
    propertyTitle: 'Suburban Family Home',
    ownershipType: 'full',
    percentage: 100,
    acquisitionDate: '2023-08-15',
    currentValue: 850000
  },
  {
    clientId: '3',
    propertyId: '2',
    propertyTitle: 'Downtown Luxury Apartment',
    ownershipType: 'full',
    percentage: 100,
    acquisitionDate: '2023-04-20',
    currentValue: 1200000
  }
];

export default function DashboardClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load clients from API
  const loadClients = async () => {
    try {
      setIsLoading(true);
      const clientsData = await ClientService.getAll();
      setClients(clientsData || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);
  const [ownerships, setOwnerships] = useState<PropertyOwnership[]>(mockOwnerships);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Client form state
  const [clientFormData, setClientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'owner' as 'owner' | 'buyer' | 'tenant',
    notes: ''
  });

  // Property assignment form state
  const [propertyFormData, setPropertyFormData] = useState({
    propertyId: '',
    ownershipType: 'full' as 'full' | 'partial',
    percentage: 100,
    acquisitionDate: '',
    currentValue: 0
  });

  const resetClientForm = () => {
    setClientFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'owner',
      notes: ''
    });
    setEditingClient(null);
  };

  const resetPropertyForm = () => {
    setPropertyFormData({
      propertyId: '',
      ownershipType: 'full',
      percentage: 100,
      acquisitionDate: '',
      currentValue: 0
    });
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        // Update existing client
        const updatedClient = await ClientService.update(editingClient.id, {
          full_name: clientFormData.name,
          email: clientFormData.email,
          phone: clientFormData.phone,
          address: clientFormData.address,
          notes: clientFormData.notes,
          is_active: true
        });
        
        if (!updatedClient) {
          return; // Error already handled by service
        }
        
        // Refresh clients list
        await loadClients();
      } else {
        // Add new client
        const newClientData = {
          ...clientFormData,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          totalProperties: 0,
          totalValue: 0,
          rating: 0,
          lastContact: new Date().toISOString().split('T')[0]
        };
        const createdClient = await ClientService.create({
          full_name: newClientData.name,
          email: newClientData.email,
          phone: newClientData.phone,
          address: newClientData.address,
          notes: newClientData.notes,
          is_active: newClientData.status === "active"
        });
        
        if (!createdClient) {
          return; // Error already handled by service
        }
        
        // Refresh clients list
        await loadClients();
      }

      setIsClientDialogOpen(false);
      resetClientForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handlePropertyAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) return;
    
    const property = properties.find(p => p.id === propertyFormData.propertyId);
    if (!property) return;

    const newOwnership: PropertyOwnership = {
      clientId: selectedClient.id,
      propertyId: propertyFormData.propertyId,
      propertyTitle: property.title,
      ownershipType: propertyFormData.ownershipType,
      percentage: propertyFormData.percentage,
      acquisitionDate: propertyFormData.acquisitionDate,
      currentValue: propertyFormData.currentValue
    };

    setOwnerships([newOwnership, ...ownerships]);
    
    // Update client's total properties and value
    setClients(clients.map(client => 
      client.id === selectedClient.id
        ? {
            ...client,
            totalProperties: client.totalProperties + 1,
            totalValue: client.totalValue + propertyFormData.currentValue
          }
        : client
    ));

    setIsPropertyDialogOpen(false);
    resetPropertyForm();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      type: client.type,
      notes: client.notes || ''
    });
    setIsClientDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }
    
    try {
      const success = await ClientService.delete(clientId);
      if (success) {
        // Also remove related ownerships
        setOwnerships(ownerships.filter(ownership => ownership.clientId !== clientId));
        // Refresh clients list
        await loadClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleRemoveProperty = (clientId: string, propertyId: string) => {
    const ownership = ownerships.find(o => o.clientId === clientId && o.propertyId === propertyId);
    if (ownership) {
      setOwnerships(ownerships.filter(o => !(o.clientId === clientId && o.propertyId === propertyId)));
      
      // Update client's total properties and value
      setClients(clients.map(client => 
        client.id === clientId
          ? {
              ...client,
              totalProperties: Math.max(0, client.totalProperties - 1),
              totalValue: Math.max(0, client.totalValue - ownership.currentValue)
            }
          : client
      ));
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getClientOwnerships = (clientId: string) => {
    return ownerships.filter(ownership => ownership.clientId === clientId);
  };

  const getStatusBadge = (status: Client['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-600/20 text-green-400' },
      inactive: { color: 'bg-gray-600/20 text-gray-400' },
      pending: { color: 'bg-yellow-600/20 text-yellow-400' }
    };
    
    return (
      <Badge className={statusConfig[status].color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: Client['type']) => {
    const typeConfig = {
      owner: { color: 'bg-blue-600/20 text-blue-400', icon: Building },
      buyer: { color: 'bg-purple-600/20 text-purple-400', icon: User },
      tenant: { color: 'bg-orange-600/20 text-orange-400', icon: Home }
    };
    
    const config = typeConfig[type];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
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
              <h1 className="text-3xl font-bold text-white mb-2">Clients Management</h1>
              <p className="text-slate-400">Manage property owners, buyers, and tenants</p>
            </div>
          </div>
          
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={resetClientForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingClient ? 'Update client information' : 'Add a new client to the system'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSaveClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={clientFormData.name}
                      onChange={(e) => setClientFormData({...clientFormData, name: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="text-slate-300">Client Type</Label>
                    <Select 
                      value={clientFormData.type} 
                      onValueChange={(value: 'owner' | 'buyer' | 'tenant') => setClientFormData({...clientFormData, type: value})}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="owner">Property Owner</SelectItem>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientFormData.email}
                      onChange={(e) => setClientFormData({...clientFormData, email: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                    <Input
                      id="phone"
                      value={clientFormData.phone}
                      onChange={(e) => setClientFormData({...clientFormData, phone: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-slate-300">Address</Label>
                  <Input
                    id="address"
                    value={clientFormData.address}
                    onChange={(e) => setClientFormData({...clientFormData, address: e.target.value})}
                    className="bg-slate-800 border-slate-700"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-slate-300">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={clientFormData.notes}
                    onChange={(e) => setClientFormData({...clientFormData, notes: e.target.value})}
                    className="bg-slate-800 border-slate-700"
                    rows={3}
                    placeholder="Additional notes about the client..."
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsClientDialogOpen(false)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                    {editingClient ? 'Update Client' : 'Add Client'}
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="owner">Property Owners</SelectItem>
              <SelectItem value="buyer">Buyers</SelectItem>
              <SelectItem value="tenant">Tenants</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clients Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Clients Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Manage all clients and their property relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Client</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Properties</TableHead>
                  <TableHead className="text-slate-300">Total Value</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const clientOwnerships = getClientOwnerships(client.id);
                  return (
                    <TableRow key={client.id} className="border-slate-800">
                      <TableCell>
                        <div className="text-white font-medium">{client.name}</div>
                        <div className="text-slate-400 text-sm">{client.email}</div>
                        <div className="text-slate-400 text-sm">{client.phone}</div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(client.type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-white">{client.totalProperties}</div>
                        {clientOwnerships.length > 0 && (
                          <div className="text-slate-400 text-sm">
                            {clientOwnerships.slice(0, 2).map(ownership => ownership.propertyTitle).join(', ')}
                            {clientOwnerships.length > 2 && ` +${clientOwnerships.length - 2} more`}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-white">${client.totalValue.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {client.type === 'owner' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                setIsPropertyDialogOpen(true);
                                resetPropertyForm();
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClient(client.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No clients found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Assignment Dialog */}
        <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Property to {selectedClient?.name}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a property to this client&apos;s portfolio
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handlePropertyAssignment} className="space-y-4">
              <div>
                <Label htmlFor="property" className="text-slate-300">Property</Label>
                <Select 
                  value={propertyFormData.propertyId} 
                  onValueChange={(value) => {
                    const property = properties.find(p => p.id === value);
                    setPropertyFormData({
                      ...propertyFormData, 
                      propertyId: value,
                      currentValue: property?.price || 0
                    });
                  }}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {properties.filter(property => 
                      !ownerships.some(ownership => 
                        ownership.propertyId === property.id && ownership.clientId === selectedClient?.id
                      )
                    ).map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - ${property.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownershipType" className="text-slate-300">Ownership Type</Label>
                  <Select 
                    value={propertyFormData.ownershipType} 
                    onValueChange={(value: 'full' | 'partial') => setPropertyFormData({...propertyFormData, ownershipType: value})}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="full">Full Ownership</SelectItem>
                      <SelectItem value="partial">Partial Ownership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="percentage" className="text-slate-300">Ownership %</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={propertyFormData.percentage}
                    onChange={(e) => setPropertyFormData({...propertyFormData, percentage: parseInt(e.target.value) || 100})}
                    className="bg-slate-800 border-slate-700"
                    disabled={propertyFormData.ownershipType === 'full'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="acquisitionDate" className="text-slate-300">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={propertyFormData.acquisitionDate}
                    onChange={(e) => setPropertyFormData({...propertyFormData, acquisitionDate: e.target.value})}
                    className="bg-slate-800 border-slate-700"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentValue" className="text-slate-300">Current Value ($)</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={propertyFormData.currentValue}
                    onChange={(e) => setPropertyFormData({...propertyFormData, currentValue: parseInt(e.target.value) || 0})}
                    className="bg-slate-800 border-slate-700"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPropertyDialogOpen(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  Assign Property
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}