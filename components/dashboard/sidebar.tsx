"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Building, 
  Upload, 
  Settings, 
  LogOut, 
  BarChart3,
  Users,
  Calendar,
  Menu,
  X,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      title: "Discovery",
      href: "/discovery",
      icon: Search,
      description: "Browse properties"
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Overview and analytics"
    },
    {
      title: "Properties",
      href: "/dashboard/properties",
      icon: Building,
      description: "Manage your listings"
    },
    {
      title: "Upload",
      href: "/dashboard/upload",
      icon: Upload,
      description: "Add new property"
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      description: "View performance metrics"
    },
    {
      title: "Tours",
      href: "/dashboard/tours",
      icon: Calendar,
      description: "Manage virtual tours"
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: Users,
      description: "Client management"
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Account settings"
    }
  ];

  const handleLogout = () => {
    // In a real app, this would clear the session/token
    router.push("/login");
  };

  return (
    <div className={cn(
      "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Vitrus</h2>
                <p className="text-slate-400 text-xs">Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  isActive 
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800",
                  isCollapsed && "px-2"
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed && (
          <Card className="bg-slate-800 border-slate-700 p-3 mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                JD
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">John Doe</p>
                <p className="text-slate-400 text-xs">Property Manager</p>
              </div>
            </div>
          </Card>
        )}
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
            isCollapsed && "px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}