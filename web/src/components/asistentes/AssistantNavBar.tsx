"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface NavBarMenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface AppNavBarProps {
  userName: string;
  userRole: string;
  avatar: string;
  avatarGradient?: string;
  notificationCount?: number;
  menuItems: NavBarMenuItem[];
  onNotificationClick?: () => void;
}

export function AppNavBar({
  userName,
  userRole,
  avatar,
  avatarGradient = "from-cyan-500 to-blue-500",
  notificationCount = 0,
  menuItems,
  onNotificationClick,
}: AppNavBarProps) {
  return (
    <header className="bg-white border-b px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            CuidApp
          </h1>
          <p className="text-sm text-muted-foreground">{userRole}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {onNotificationClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${avatarGradient} text-white text-sm`}>
                    {avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <DropdownMenuSeparator />
              
              {menuItems.map((item, index) => {
                const isLastItem = index === menuItems.length - 1;
                const isDestructive = item.variant === "destructive";
                
                return (
                  <div key={index}>
                    {isLastItem && menuItems.length > 1 && <DropdownMenuSeparator />}
                    <DropdownMenuItem 
                      onClick={item.onClick}
                      className={isDestructive ? "text-red-600" : ""}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
