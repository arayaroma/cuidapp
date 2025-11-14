"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function DashboardLayout({ 
  children, 
  backgroundColor = "bg-gray-50 dark:bg-gray-900"
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen ${backgroundColor} p-3 sm:p-6 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
