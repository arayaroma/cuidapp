"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function DashboardHeader({
  icon: Icon,
  title,
  subtitle,
  gradientFrom = "blue-500",
  gradientTo = "cyan-500",
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-${gradientFrom.replace('500', '600')} to-${gradientTo.replace('500', '600')} bg-clip-text text-transparent`}>
            {title}
          </h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
