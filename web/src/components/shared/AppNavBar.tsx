"use client";

import { User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { colors } from "@/config/colors";

interface AppNavBarProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  avatarGradient?: string;
  onProfileClick?: () => void;
}

export function AppNavBar({
  title = "CuidApp",
  userName,
  userEmail,
  avatarGradient,
  onProfileClick,
}: AppNavBarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const displayName = userName || session?.user?.name || "Usuario";
  const displayEmail = userEmail || session?.user?.email;
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push("/usuarios/profile");
    }
  };

  return (
    <div 
      className="text-white shadow-lg backdrop-blur-sm"
      style={{ background: colors.gradients.trust }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 rounded-full hover:bg-white/10 transition-all"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarFallback
                      className="text-white font-semibold"
                      style={{ 
                        background: avatarGradient || colors.gradients.trust 
                      }}
                    >
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {displayEmail}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
