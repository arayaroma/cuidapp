"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface NavMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
  variant?: "default" | "destructive";
}

export interface NavSection {
  title?: string;
  items: NavMenuItem[];
}

interface NavigationDrawerProps {
  userName: string;
  avatar?: string;
  avatarGradient?: string;
  sections: NavSection[];
  onLogout?: () => void;
  logoGradient?: string;
}

export function NavigationDrawer({
  userName,
  avatar,
  avatarGradient = "from-cyan-500 to-blue-500",
  sections,
  onLogout,
}: NavigationDrawerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const avatarText =
    avatar ||
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    "U";

  const handleNavigation = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <div className="flex flex-col h-full">
          {/* Header del menú */}
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback
                  className={`bg-gradient-to-br ${avatarGradient} text-white text-lg font-semibold`}
                >
                  {avatarText}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <SheetTitle className="text-base font-semibold">
                  {userName}
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          <Separator />

          {/* Contenido del menú */}
          <div className="flex-1 overflow-y-auto py-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="px-3 mb-4">
                {section.title && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const isDestructive = item.variant === "destructive";
                    return (
                      <button
                        key={itemIndex}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isDestructive
                            ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isDestructive ? "text-red-600" : "text-muted-foreground"
                        )} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                            isDestructive 
                              ? "bg-red-100 text-red-700"
                              : "bg-cyan-100 text-cyan-700"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer del menú */}
          {onLogout && (
            <>
              <Separator />
              <div className="p-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
