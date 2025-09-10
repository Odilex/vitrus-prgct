"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  CreditCard,
  BarChart2,
  UserCog,
  TicketCheck,
  Settings,
  LogOut,
  X,
  Menu,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Discovery",
    href: "/discovery",
    icon: <Search className="h-5 w-5" />,
  },
  {
    name: "User Dashboard",
    href: "/dashboard",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Staff Dashboard",
    href: "/staff",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Properties",
    href: "/staff/properties",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Owners/Clients",
    href: "/staff/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Tours",
    href: "/staff/tours",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Payments",
    href: "/staff/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    name: "Analytics",
    href: "/staff/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    name: "Staff & Roles",
    href: "/staff/team",
    icon: <UserCog className="h-5 w-5" />,
  },
  {
    name: "Support Tickets",
    href: "/staff/tickets",
    icon: <TicketCheck className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/staff/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("vitrus-staff-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("vitrus-staff-user");
    
    // Redirect to login page
    router.push("/staff/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-slate-800 border-slate-700 hover:bg-slate-700"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/staff" className="flex items-center">
            <span className="text-xl font-bold text-blue-500">Vitrus</span>
            <span className="text-xl font-bold ml-1">Rwanda</span>
            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded ml-2">
              Staff
            </span>
          </Link>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-semibold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs text-slate-400">
                  <span className="capitalize">{currentUser.role}</span> Role
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-md transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}