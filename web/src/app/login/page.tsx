"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "@/components/login/LoginHeader";
import { UserTypeSelection, NameInput } from "@/components/login/LoginFormFields";
import { EmailPasswordFields, LoginActions } from "@/components/login/LoginActions";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginPage() {
  const {
    isRegistering,
    showPassword,
    userType,
    email,
    password,
    name,
    error,
    setUserType,
    setEmail,
    setPassword,
    setName,
    toggleMode,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleLogin,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-sky-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <LoginHeader isRegistering={isRegistering} />

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <UserTypeSelection 
                  userType={userType} 
                  onUserTypeChange={setUserType} 
                />
                <NameInput 
                  name={name} 
                  onNameChange={setName} 
                />
              </>
            )}

            <EmailPasswordFields
              email={email}
              password={password}
              showPassword={showPassword}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onTogglePassword={togglePasswordVisibility}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-md transition-all duration-300"
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
          </form>

          <LoginActions
            isRegistering={isRegistering}
            onGoogleLogin={handleGoogleLogin}
            onToggleMode={toggleMode}
          />
        </CardContent>
      </Card>
    </div>
  );
}
