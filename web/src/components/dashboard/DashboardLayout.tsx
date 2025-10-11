"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function DashboardLayout({ 
  children, 
  backgroundColor = "from-cyan-50 via-blue-50 to-sky-100" 
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundColor} p-8`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
