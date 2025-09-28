"use client";

import { useState, useEffect } from "react";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  RefreshCw
} from "lucide-react";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentsData, setPaymentsData] = useState<PaymentsData>({ stats: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentsData = async () => {
      try {
        setLoading(true);
        const data = await PaymentsService.getPaymentsData();
        setPaymentsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load payments data');
        console.error('Error loading payments data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentsData();
  }, []);

  // Payment data interfaces
  interface PaymentStat {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
  }

  interface Payment {
    id: string;
    client: string;
    property: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'processing';
    method: string;
    date: string;
    type: string;
  }

  interface PaymentsData {
    stats: PaymentStat[];
    payments: Payment[];
  }

  // Payments service for API integration
  class PaymentsService {
    private static readonly BASE_URL = '/api/v1/payments';

    static async getPaymentsData(): Promise<PaymentsData> {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${this.BASE_URL}/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payments data');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching payments data:', error);
        // Return default data structure
        return {
          stats: [
            {
              title: "Total Revenue",
              value: "$0",
              change: "0%",
              icon: <DollarSign className="h-5 w-5" />
            },
            {
              title: "Pending Payments",
              value: "$0",
              change: "0%",
              icon: <AlertCircle className="h-5 w-5" />
            },
            {
              title: "Processed Today",
              value: "$0",
              change: "0%",
              icon: <CreditCard className="h-5 w-5" />
            },
            {
              title: "Monthly Growth",
              value: "0%",
              change: "0%",
              icon: <TrendingUp className="h-5 w-5" />
            }
          ],
          payments: []
        };
      }
    }

    static async updatePaymentStatus(paymentId: string, status: string): Promise<Payment | null> {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${this.BASE_URL}/${paymentId}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          throw new Error('Failed to update payment status');
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating payment status:', error);
        return null;
      }
    }
  }

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex">
        <StaffSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading payments data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex">
        <StaffSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "processing": return "bg-blue-500/20 text-blue-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredPayments = paymentsData.payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Payment Management</h1>
              <p className="text-slate-400">Manage transactions, billing, and financial records</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    New Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Payment</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Record a new payment transaction
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="client" className="text-right">Client</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="mike">Mike Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">Amount</Label>
                      <Input id="amount" placeholder="$0.00" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="method" className="text-right">Method</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="wire">Wire Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Payment type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="commission">Commission</SelectItem>
                          <SelectItem value="rental">Rental Fee</SelectItem>
                          <SelectItem value="service">Service Fee</SelectItem>
                          <SelectItem value="purchase">Purchase Fee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">Notes</Label>
                      <Textarea id="notes" placeholder="Additional notes..." className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                      Create Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paymentsData.stats.map((stat, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      {stat.icon}
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Management */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Payment Transactions</CardTitle>
              <CardDescription className="text-slate-400">Manage and track all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payments Table */}
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-300">Payment ID</TableHead>
                      <TableHead className="text-slate-300">Client</TableHead>
                      <TableHead className="text-slate-300">Property</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">Method</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="border-slate-800">
                        <TableCell className="font-medium text-white">{payment.id}</TableCell>
                        <TableCell className="text-slate-300">{payment.client}</TableCell>
                        <TableCell className="text-slate-300">{payment.property}</TableCell>
                        <TableCell className="text-slate-300">${payment.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-slate-300">{payment.method}</TableCell>
                        <TableCell className="text-slate-300">{payment.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{payment.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {payment.status === "failed" && (
                              <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            )}
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

export default Payments;