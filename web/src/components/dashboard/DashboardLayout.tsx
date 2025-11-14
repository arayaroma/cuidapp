"use client";

import { ReactNode, CSSProperties } from "react";
import { colors } from "@/config/colors";

interface DashboardLayoutProps {
  children: ReactNode;
  /**
   * Optional tailwind class for background (kept for backward compatibility)
   */
  backgroundClass?: string;
  /**
   * Optional inline style for background, preferred to use colors.* from config
   */
  backgroundStyle?: CSSProperties;
}

export function DashboardLayout({ 
  children, 
  backgroundClass = "bg-gray-50 dark:bg-gray-900",
  backgroundStyle,
}: DashboardLayoutProps) {
  const defaultStyle: CSSProperties = { background: colors.background.secondary };

  return (
    <div className={`min-h-screen p-8 ${backgroundClass}`} style={backgroundStyle || defaultStyle}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
