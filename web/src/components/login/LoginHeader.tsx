"use client";

import { Heart } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface LoginHeaderProps {
  isRegistering: boolean;
}

export function LoginHeader({ isRegistering }: LoginHeaderProps) {
  return (
    <CardHeader className="text-center space-y-2 pb-8">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
        <Heart className="w-8 h-8 text-white" />
      </div>
      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
        CuidApp
      </CardTitle>
      <p className="text-muted-foreground">
        {isRegistering
          ? "Crea tu cuenta y comienza a cuidar"
          : "Conectando familias con cuidadores profesionales"}
      </p>
    </CardHeader>
  );
}
