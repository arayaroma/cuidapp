"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function DashboardLayout({ 
  children, 
  backgroundColor = "from-blue-100 via-purple-50 to-pink-100" 
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundColor} p-8`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
