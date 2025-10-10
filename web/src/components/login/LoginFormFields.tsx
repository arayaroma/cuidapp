"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserTypeSelectionProps {
  userType: 'caregiver' | 'client';
  onUserTypeChange: (value: 'caregiver' | 'client') => void;
}

export function UserTypeSelection({ userType, onUserTypeChange }: UserTypeSelectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Tipo de cuenta</Label>
      <RadioGroup 
        value={userType} 
        onValueChange={(value) => onUserTypeChange(value as 'caregiver' | 'client')}
      >
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client" className="cursor-pointer flex-1">
            Usuario (Busco cuidador)
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
          <RadioGroupItem value="caregiver" id="caregiver" />
          <Label htmlFor="caregiver" className="cursor-pointer flex-1">
            Asistente (Ofrezco servicios)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

interface NameInputProps {
  name: string;
  onNameChange: (value: string) => void;
}

export function NameInput({ name, onNameChange }: NameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nombre completo</Label>
      <Input 
        id="name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Tu nombre completo"
        className="focus:ring-2 focus:ring-cyan-500"
        required
      />
    </div>
  );
}
