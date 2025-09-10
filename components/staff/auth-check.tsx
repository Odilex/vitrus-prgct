"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type StaffRole = "admin" | "editor" | "support";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  avatar?: string;
};

// Authentication service for real auth integration
class AuthService {
  private static readonly BASE_URL = '/api/v1/auth';

  static async getCurrentUser(): Promise<StaffUser | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
        }
        throw new Error(`Auth API error: ${response.status}`);
      }

      const userData = await response.json();
      return userData.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  static async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      const response = await fetch(`${this.BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('vitrus-staff-user');
  }
}

export default function StaffAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setCurrentUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First validate the token
        const isValidToken = await AuthService.validateToken();
        if (!isValidToken) {
          AuthService.logout();
          router.push("/staff/login");
          return;
        }

        // Get current user data
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          AuthService.logout();
          router.push("/staff/login");
          return;
        }

        // Set authentication state
        setCurrentUser(currentUser);
        setIsAuthenticated(true);
        
        // Store user data for persistence
        localStorage.setItem("vitrus-staff-user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Authentication error:", error);
        AuthService.logout();
        setIsAuthenticated(false);
        router.push("/staff/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login (handled in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children with user context
  return (
    <div className="staff-authenticated">
      {children}
    </div>
  );
}