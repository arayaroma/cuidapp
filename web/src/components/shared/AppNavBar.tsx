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
} from "@/components/ui/dropdown-menu";
import { NavigationDrawer, NavSection } from "@/components/shared/NavigationDrawer";

export interface NavBarMenuItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface AppNavBarProps {
  userName?: string;
  menuItems?: NavBarMenuItem[];
  avatarGradient?: string;
  onLogout?: () => void;
  navSections?: NavSection[];
}

export function AppNavBar({
  userName,
  menuItems,
  avatarGradient = "from-cyan-500 to-blue-500",
  onLogout,
  navSections = [],
}: AppNavBarProps) {
  const avatar = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="bg-white border-b px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Drawer */}
          <div className="flex items-center gap-3">
            {navSections.length > 0 && (
              <NavigationDrawer
                userName={userName || "Usuario"}
                avatarGradient={avatarGradient}
                sections={navSections}
                onLogout={onLogout}
              />
            )}
            {/* Logo */}
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              CuidApp
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
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
              </div>
              <DropdownMenuSeparator />
              
              {menuItems?.map((item, index) => {
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
      </div>
    </header>
  );
}
