"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export interface LoginFormData {
  email: string;
  password: string;
  name?: string;
  userType: 'caregiver' | 'client';
}

export function useLoginForm() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'caregiver' | 'client'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(''); // Limpiar error al cambiar de modo
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar error anterior
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        name: isRegistering ? name : undefined,
        userType,
        action: isRegistering ? "register" : "login",
        redirect: false,
      });

      if (result?.error) {
        console.error("Authentication error:", result.error);
        
        // Manejar errores específicos basados en el mensaje de error
        if (result.error.includes("Usuario no encontrado")) {
          setError("Usuario no encontrado. ¿Ya te registraste?");
        } else if (result.error.includes("Contraseña incorrecta")) {
          setError("Contraseña incorrecta. Verifica tu contraseña.");
        } else if (result.error.includes("Ya existe un usuario")) {
          setError("Ya existe un usuario con este correo electrónico.");
        } else if (result.error.includes("Datos de registro inválidos")) {
          setError("Datos de registro inválidos. Completa todos los campos correctamente.");
        } else if (result.error.includes("Email o contraseña inválidos")) {
          setError("Email o contraseña inválidos.");
        } else {
          setError("Error de autenticación. Inténtalo nuevamente.");
        }
        return;
      }

      if (result?.ok) {
        // Limpiar campos y error
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        
        // Esperar un momento para que la sesión se actualice
        setTimeout(async () => {
          // Obtener la sesión actualizada
          const response = await fetch('/api/auth/session');
          const session = await response.json();
          
          // Redirigir basándose en el rol real
          if (session?.user?.role === 'assistant') {
            window.location.href = '/asistentes/dashboard';
          } else {
            window.location.href = '/usuarios/dashboard';
          }
        }, 500);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.");
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    // Implementar OAuth con Google aquí
  };

  return {
    // Estados
    isRegistering,
    showPassword,
    userType,
    email,
    password,
    name,
    error,
    
    // Setters
    setUserType,
    setEmail,
    setPassword,
    setName,
    
    // Acciones
    toggleMode,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleLogin,
  };
}
