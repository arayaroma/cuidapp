"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí puedes agregar la lógica de autenticación
    console.log({
      userType,
      email,
      password,
      name: isRegistering ? name : undefined,
      action: isRegistering ? 'register' : 'login'
    });

    // Redirección según el tipo de usuario
    if (userType === 'caregiver') {
      router.push('/asistentes');
    } else {
      router.push('/usuarios');
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
