"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, Users } from "lucide-react";

// Analytics data interfaces
interface TopPerformingProperty {
  name: string;
  views: number;
}

interface MonthlyTrends {
  views: string;
  inquiries: string;
  bookings: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  averageTimeOnSite: string;
  topPerformingProperties: TopPerformingProperty[];
  monthlyTrends: MonthlyTrends;
}

// Analytics service for API integration
class AnalyticsService {
  private static readonly BASE_URL = '/api/v1/analytics';

  static async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.BASE_URL}/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Return default empty data structure on error
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        averageTimeOnSite: "0:00",
        topPerformingProperties: [],
        monthlyTrends: {
          views: "0%",
          inquiries: "0%",
          bookings: "0%"
        }
      };
    }
  }
}

export default function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    averageTimeOnSite: "0:00",
    topPerformingProperties: [],
    monthlyTrends: {
      views: "0%",
      inquiries: "0%",
      bookings: "0%"
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AnalyticsService.getAnalyticsData();
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-400 hover:text-blue-300"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-2xl font-bold text-white">{analyticsData.totalViews.toLocaleString()}</div>
            </div>
            <p className="text-xs text-green-400 mt-1">{analyticsData.monthlyTrends.views} from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-500 mr-2" />
              <div className="text-2xl font-bold text-white">{analyticsData.uniqueVisitors.toLocaleString()}</div>
            </div>
            <p className="text-xs text-green-400 mt-1">{analyticsData.monthlyTrends.inquiries} from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
              <div className="text-2xl font-bold text-white">{analyticsData.conversionRate}%</div>
            </div>
            <p className="text-xs text-green-400 mt-1">{analyticsData.monthlyTrends.bookings} from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-200 text-sm font-medium">Avg. Time on Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-orange-500 mr-2" />
              <div className="text-2xl font-bold text-white">{analyticsData.averageTimeOnSite}</div>
            </div>
            <p className="text-xs text-slate-400 mt-1">minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Properties */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">Top Performing Properties</CardTitle>
          <CardDescription className="text-slate-400">
            Properties with the highest engagement this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPerformingProperties.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{property.name}</p>
                    <p className="text-slate-400 text-sm">{property.views} views</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-slate-400 mr-1" />
                  <span className="text-slate-300">{property.views}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">Property Views Over Time</CardTitle>
          <CardDescription className="text-slate-400">
            Monthly view trends for your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Interactive chart will be displayed here</p>
              <p className="text-slate-500 text-sm mt-2">Connect your analytics service to view detailed metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}