"use client";

import { useState, useEffect } from "react";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  ArrowUpRight, 
  Home, 
  Users, 
  Calendar, 
  CreditCard,
  Bell,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Dashboard data interfaces
interface KPIData {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface PropertyStatistic {
  month: string;
  listings: number;
  sales: number;
  rentals: number;
}

interface PropertyTypeData {
  name: string;
  value: number;
}

interface PropertyData {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface DashboardData {
  kpiData: KPIData[];
  additionalKpiData: KPIData[];
  propertyStatistics: PropertyStatistic[];
  propertyTypeData: PropertyTypeData[];
  propertyData: PropertyData[];
  revenueData: RevenueData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// API service for dashboard data
class DashboardService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return default empty data structure
      return {
        kpiData: [
          {
            title: "Total Properties",
            value: "0",
            change: "0%",
            icon: <Home className="h-4 w-4" />,
            trend: "up",
          },
          {
            title: "Active Owners",
            value: "0",
            change: "0%",
            icon: <Users className="h-4 w-4" />,
            trend: "up",
          },
        ],
        additionalKpiData: [
          {
            title: "Tours This Month",
            value: "0",
            change: "0%",
            icon: <Calendar className="h-4 w-4" />,
            trend: "up",
          },
          {
            title: "Revenue (MTD)",
            value: "$0",
            change: "0%",
            icon: <CreditCard className="h-4 w-4" />,
            trend: "up",
          },
        ],
        propertyStatistics: [],
        propertyTypeData: [],
        propertyData: [],
        revenueData: [],
      };
    }
  }
}

interface RecentProperty {
  id: string;
  name: string;
  owner: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// Additional API services
class PropertyManagementService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  static async getRecentProperties(): Promise<RecentProperty[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/properties/recent`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recent properties: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent properties:', error);
      return [];
    }
  }

  static async getPendingTasks(): Promise<PendingTask[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pending tasks: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      return [];
    }
  }
}

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [dashboard, properties, tasks] = await Promise.all([
          DashboardService.getDashboardData(),
          PropertyManagementService.getRecentProperties(),
          PropertyManagementService.getPendingTasks(),
        ]);
        
        setDashboardData(dashboard);
        setRecentProperties(properties);
        setPendingTasks(tasks);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <StaffSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Staff Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back, manage your properties and users</p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                  3
                </span>
              </div>
              <div className="ml-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search..." 
                  className="w-full md:w-64 bg-slate-900 border-slate-700 text-slate-300 pl-10"
                />
              </div>
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {dashboardData.kpiData.map((kpi, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      {kpi.icon}
                    </div>
                    <Badge 
                      variant={kpi.trend === "up" ? "success" : "destructive"}
                      className={kpi.trend === "up" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
                    >
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-slate-400">{kpi.title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
            {dashboardData.additionalKpiData.map((kpi, index) => (
              <Card key={index + dashboardData.kpiData.length} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      {kpi.icon}
                    </div>
                    <Badge 
                      variant={kpi.trend === "up" ? "success" : "destructive"}
                      className={kpi.trend === "up" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
                    >
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-slate-400">{kpi.title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="bg-slate-900 border-slate-800">
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
              <TabsTrigger value="properties" onClick={() => setActiveTab("properties")}>Properties</TabsTrigger>
              <TabsTrigger value="revenue" onClick={() => setActiveTab("revenue")}>Revenue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Status Chart */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Property Status</CardTitle>
                    <CardDescription className="text-slate-400">Monthly property approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.propertyStatistics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                            itemStyle={{ color: '#F9FAFB' }}
                            labelStyle={{ color: '#F9FAFB' }}
                          />
                          <Bar dataKey="listings" name="New Listings" fill="#3B82F6" />
                          <Bar dataKey="sales" name="Sales" fill="#10B981" />
                          <Bar dataKey="rentals" name="Rentals" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Property Types Chart */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Property Types</CardTitle>
                    <CardDescription className="text-slate-400">Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.propertyTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {dashboardData.propertyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                            itemStyle={{ color: '#F9FAFB' }}
                            formatter={(value) => [`${value} properties`, 'Count']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Revenue Chart */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Trend</CardTitle>
                    <CardDescription className="text-slate-400">Monthly revenue in USD</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboardData.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px" }}
                            itemStyle={{ color: "#f1f5f9" }}
                            labelStyle={{ color: "#f1f5f9" }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Types */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Property Types</CardTitle>
                    <CardDescription className="text-slate-400">Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.propertyTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {dashboardData.propertyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px" }}
                            itemStyle={{ color: "#f1f5f9" }}
                            labelStyle={{ color: "#f1f5f9" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Properties */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Recent Properties</CardTitle>
                      <CardDescription className="text-slate-400">Latest property submissions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProperties.map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{property.name}</p>
                            <p className="text-sm text-slate-400">Owner: {property.owner}</p>
                          </div>
                          <div className="flex items-center">
                            <Badge 
                              variant={
                                property.status === "approved" ? "success" : 
                                property.status === "pending" ? "warning" : "destructive"
                              }
                              className={
                                property.status === "approved" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : 
                                property.status === "pending" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : 
                                "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              }
                            >
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart (Duplicate for this tab) */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Breakdown</CardTitle>
                    <CardDescription className="text-slate-400">By subscription type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { plan: "Basic", amount: 3200 },
                          { plan: "Standard", amount: 5800 },
                          { plan: "Premium", amount: 3450 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="plan" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px" }}
                            itemStyle={{ color: "#f1f5f9" }}
                            labelStyle={{ color: "#f1f5f9" }}
                          />
                          <Bar dataKey="amount" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Pending Tasks */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Pending Tasks</CardTitle>
                      <CardDescription className="text-slate-400">Items requiring attention</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-slate-400">{task.description}</p>
                          </div>
                          <Badge 
                            variant={task.priority === "high" ? "destructive" : "outline"}
                            className={
                              task.priority === "high" 
                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                                : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}