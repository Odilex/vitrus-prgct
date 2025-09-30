"use client";

import { useState } from "react";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import {
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  DollarSign,
  Calendar,
  Download,
  Filter
} from "lucide-react";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");

  // Mock analytics data
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$124,500",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Active Properties",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: <Home className="h-5 w-5" />
    },
    {
      title: "Total Clients",
      value: "89",
      change: "+15.3%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Tours Completed",
      value: "234",
      change: "-2.1%",
      trend: "down",
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000, properties: 45 },
    { month: "Feb", revenue: 15000, properties: 52 },
    { month: "Mar", revenue: 18000, properties: 58 },
    { month: "Apr", revenue: 22000, properties: 65 },
    { month: "May", revenue: 25000, properties: 72 },
    { month: "Jun", revenue: 28000, properties: 78 }
  ];

  const propertyTypeData = [
    { name: "Residential", value: 65, color: "#3b82f6" },
    { name: "Commercial", value: 25, color: "#10b981" },
    { name: "Industrial", value: 10, color: "#f59e0b" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-slate-400">Comprehensive insights and performance metrics</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex gap-2 mb-6">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange(range)}
                className={dateRange === range ? "bg-blue-600" : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
              </Button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      {kpi.icon}
                    </div>
                    <Badge 
                      variant={kpi.trend === "up" ? "default" : "destructive"}
                      className={kpi.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                    >
                      {kpi.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
                    <p className="text-slate-400 text-sm">{kpi.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
                <CardDescription className="text-slate-400">Monthly revenue and property growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Property Types */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Property Distribution</CardTitle>
                <CardDescription className="text-slate-400">Properties by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-slate-400">Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
                  <TabsTrigger value="properties" className="data-[state=active]:bg-slate-700">Properties</TabsTrigger>
                  <TabsTrigger value="clients" className="data-[state=active]:bg-slate-700">Clients</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <h4 className="text-lg font-semibold text-white">Conversion Rate</h4>
                      <p className="text-2xl font-bold text-green-400">24.5%</p>
                      <p className="text-sm text-slate-400">+3.2% from last month</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <h4 className="text-lg font-semibold text-white">Avg. Deal Size</h4>
                      <p className="text-2xl font-bold text-blue-400">$1,250</p>
                      <p className="text-sm text-slate-400">+8.1% from last month</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <h4 className="text-lg font-semibold text-white">Client Satisfaction</h4>
                      <p className="text-2xl font-bold text-yellow-400">4.8/5</p>
                      <p className="text-sm text-slate-400">Based on 156 reviews</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="properties" className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Bar dataKey="properties" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="clients" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">New Clients This Month</h4>
                        <p className="text-slate-400">23 new registrations</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">+15.3%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Active Clients</h4>
                        <p className="text-slate-400">89 currently active</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">+8.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Client Retention</h4>
                        <p className="text-slate-400">92% retention rate</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">+2.1%</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;