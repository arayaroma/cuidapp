"use client";

import { User, LogOut, Heart, Settings, Home } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { colors } from "@/config/colors";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "assistant";
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

interface AppNavBarProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  avatarGradient?: string;
  onProfileClick?: () => void;
  userRole?: "user" | "assistant";
}

export function AppNavBar({
  title = "CuidApp",
  userName,
  userEmail,
  avatarGradient,
  onProfileClick,
  userRole = "user",
}: AppNavBarProps) {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"user" | "assistant">("user");

  useEffect(() => {
    if (session?.user?.role) {
      setRole(session.user.role);
    }
  }, [session]);

  const displayName = userName || session?.user?.name || "Usuario";
  const displayEmail = userEmail || session?.user?.email;
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      const profilePath = role === "assistant" ? "/asistentes/profile" : "/usuarios/profile";
      router.push(profilePath);
    }
  };

  const handleLogoClick = () => {
    const dashboardPath = role === "assistant" ? "/asistentes/dashboard" : "/usuarios/dashboard";
    router.push(dashboardPath);
  };

  return (
    <nav 
      className="text-white shadow-lg backdrop-blur-sm sticky top-0 z-50"
      style={{ background: colors.gradients.trust }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform"
              style={{ background: "rgba(255, 255, 255, 0.2)" }}
            >
              <Heart className="w-6 h-6" fill="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <p className="text-xs opacity-90 -mt-1">Cuidado con amor</p>
            </div>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Home Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogoClick}
              className="sm:hidden hover:bg-white/10 transition-all"
              title="Ir al inicio"
            >
              <Home className="w-5 h-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 rounded-full hover:bg-white/10 transition-all px-2 sm:px-3 gap-2"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white/30">
                    <AvatarFallback
                      className="text-white font-semibold text-sm"
                      style={{ 
                        background: avatarGradient || colors.gradients.primary 
                      }}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block font-medium text-sm max-w-[120px] truncate">
                    {displayName.split(" ")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* User Info Header */}
                <div className="px-3 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      className="h-12 w-12 ring-2 ring-offset-2"
                      style={{ 
                        borderColor: colors.primary[300],
                      }}
                    >
                      <AvatarFallback
                        className="text-white font-semibold"
                        style={{ 
                          background: avatarGradient || colors.gradients.primary 
                        }}
                      >
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate" style={{ color: colors.neutral[900] }}>
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p className="text-xs leading-none truncate" style={{ color: colors.neutral[600] }}>
                          {displayEmail}
                        </p>
                      )}
                      <Badge 
                        variant="outline" 
                        className="w-fit text-xs"
                        style={{ 
                          borderColor: colors.primary[300],
                          color: colors.primary[700],
                          backgroundColor: colors.primary[50]
                        }}
                      >
                        {role === "assistant" ? "Asistente" : "Usuario"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Menu Items */}
                <DropdownMenuItem 
                  onClick={handleLogoClick}
                  className="cursor-pointer"
                >
                  <Home className="mr-2 h-4 w-4" style={{ color: colors.primary[600] }} />
                  <span>Inicio</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleProfileClick}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" style={{ color: colors.secondary[600] }} />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
