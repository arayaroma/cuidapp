"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EmailPasswordFieldsProps {
  email: string;
  password: string;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
}

export function EmailPasswordFields({
  email,
  password,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
}: EmailPasswordFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="tu@email.com"
          className="focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            required
            className="focus:ring-2 focus:ring-cyan-500 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

interface LoginActionsProps {
  isRegistering: boolean;
  onGoogleLogin: () => void;
  onToggleMode: () => void;
}

export function LoginActions({ 
  isRegistering, 
  onGoogleLogin, 
  onToggleMode 
}: LoginActionsProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full hover:bg-accent/50 transition-all duration-300"
        onClick={onGoogleLogin}
        type="button"
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-cyan-600 transition-colors underline-offset-4 hover:underline"
          onClick={onToggleMode}
        >
          {isRegistering 
            ? '¿Ya tienes una cuenta? Inicia sesión' 
            : '¿No tienes cuenta? Regístrate'
          }
        </button>
      </div>
    </div>
  );
}
