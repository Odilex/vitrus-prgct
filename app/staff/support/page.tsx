"use client";

import { useState, useEffect } from "react";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  TicketCheck,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Plus,
  MessageSquare,
  User,
  Calendar,
  Tag,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

// Support data interfaces
interface SupportStat {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  client: string;
  email: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  category: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
}

interface SupportData {
  stats: SupportStat[];
  tickets: SupportTicket[];
}

// Support service for API integration
class SupportService {
  private static readonly BASE_URL = '/api/v1/support';

  static async getSupportData(): Promise<SupportData> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch support data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching support data:', error);
      // Return default data structure
      return {
        stats: [
          {
            title: "Open Tickets",
            value: "0",
            change: "No data",
            icon: <TicketCheck className="h-5 w-5" />,
            color: "text-blue-400"
          },
          {
            title: "Pending Review",
            value: "0",
            change: "No data",
            icon: <Clock className="h-5 w-5" />,
            color: "text-yellow-400"
          },
          {
            title: "Resolved Today",
            value: "0",
            change: "No data",
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-400"
          },
          {
            title: "Critical Issues",
            value: "0",
            change: "No data",
            icon: <AlertCircle className="h-5 w-5" />,
            color: "text-red-400"
          }
        ],
        tickets: []
      };
    }
  }

  static async updateTicketStatus(ticketId: string, status: string): Promise<SupportTicket | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return null;
    }
  }

  static async createTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): Promise<SupportTicket | null> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  }
}

const SupportTickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [supportData, setSupportData] = useState<SupportData>({ stats: [], tickets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        setLoading(true);
        const data = await SupportService.getSupportData();
        setSupportData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load support data');
        console.error('Error loading support data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSupportData();
  }, []);

  // Filter tickets based on search and filters
  const filteredTickets = supportData.tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-500/20 text-blue-400";
      case "in_progress": return "bg-yellow-500/20 text-yellow-400";
      case "pending": return "bg-orange-500/20 text-orange-400";
      case "resolved": return "bg-green-500/20 text-green-400";
      case "closed": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
      case "high":
        return <ArrowUp className="h-3 w-3" />;
      case "low":
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading support data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
              <p className="text-slate-400">Manage customer support requests and issues</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Create a new support ticket for a client issue
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="client" className="text-right">Client</Label>
                      <Input id="client" placeholder="Client name" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" type="email" placeholder="client@email.com" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input id="title" placeholder="Brief description of the issue" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Category</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="booking">Booking</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">Priority</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignee" className="text-right">Assign To</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                          <SelectItem value="michael">Michael Chen</SelectItem>
                          <SelectItem value="emily">Emily Rodriguez</SelectItem>
                          <SelectItem value="john">John Anderson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea id="description" placeholder="Detailed description of the issue..." className="col-span-3 bg-slate-800 border-slate-700" rows={4} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                      Create Ticket
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {supportData.stats.map((stat, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Tickets */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Support Tickets</CardTitle>
              <CardDescription className="text-slate-400">Manage and track customer support requests</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tickets Table */}
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-300">Ticket</TableHead>
                      <TableHead className="text-slate-300">Client</TableHead>
                      <TableHead className="text-slate-300">Priority</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Assigned To</TableHead>
                      <TableHead className="text-slate-300">Created</TableHead>
                      <TableHead className="text-slate-300">Responses</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-slate-800">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{ticket.id}</p>
                            <p className="text-sm text-slate-400 max-w-xs truncate">{ticket.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white">{ticket.client}</p>
                            <p className="text-sm text-slate-400">{ticket.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityIcon(ticket.priority)}
                            <span className="ml-1">{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            <Tag className="h-3 w-3 mr-1" />
                            {ticket.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-slate-700 text-white text-xs">
                                {ticket.assignedTo.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-slate-300 text-sm">{ticket.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">{ticket.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-300">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-sm">{ticket.responses}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                              View
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Reply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;