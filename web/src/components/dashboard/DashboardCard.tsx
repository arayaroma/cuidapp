"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { colors } from "@/config/colors";

interface DashboardCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonGradient?: string;
  onClick?: () => void;
  badge?: number;
}

export function DashboardCard({
  icon: Icon,
  iconColor,
  title,
  description,
  buttonText,
  buttonGradient,
  onClick,
  badge,
}: DashboardCardProps) {
  const gradient = buttonGradient || colors.gradients.trust;
  const iconBg = iconColor || colors.primary[500];

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border border-gray-100 bg-white hover:scale-[1.02] hover:border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl shadow-sm relative"
            style={{ backgroundColor: `${iconBg}15` }}
          >
            <Icon 
              className="w-6 h-6" 
              style={{ color: iconBg }}
            />
            {badge && badge > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
              >
                {badge > 99 ? '99+' : badge}
              </Badge>
            )}
          </div>
          <span className="text-lg font-semibold text-gray-800">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem]">
          {description}
        </p>
        <Button 
          className="w-full text-white font-semibold shadow-md hover:shadow-lg transition-all"
          style={{ background: gradient }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
