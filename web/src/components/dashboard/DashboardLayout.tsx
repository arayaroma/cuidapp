"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function DashboardLayout({ 
  children, 
  backgroundColor = "bg-white"
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen ${backgroundColor} p-8`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
