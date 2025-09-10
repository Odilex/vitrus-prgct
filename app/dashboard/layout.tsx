"use client";

import AuthGuard from '../../components/auth/AuthGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard showInlineLogin={true}>
      {children}
    </AuthGuard>
  );
}