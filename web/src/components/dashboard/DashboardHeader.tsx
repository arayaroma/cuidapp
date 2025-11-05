"use client";

import { LucideIcon } from "lucide-react";
import { colors } from "@/config/colors";

interface DashboardHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  gradient?: string;
}

export function DashboardHeader({
  icon: Icon,
  title,
  subtitle,
  gradient = colors.gradients.trust,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-5">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
          style={{ background: gradient }}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 
            className="text-5xl font-bold mb-2 tracking-tight"
            style={{ 
              background: gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h1>
          <p className="text-gray-500 text-lg font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
