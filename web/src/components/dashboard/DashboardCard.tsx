"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonGradient: {
    from: string;
    to: string;
  };
  onClick?: () => void;
}

export function DashboardCard({
  icon: Icon,
  iconColor,
  title,
  description,
  buttonText,
  buttonGradient,
  onClick,
}: DashboardCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <Button 
          className={`w-full bg-gradient-to-r from-${buttonGradient.from} to-${buttonGradient.to} hover:from-${buttonGradient.from.replace('500', '600')} hover:to-${buttonGradient.to.replace('500', '600')}`}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
