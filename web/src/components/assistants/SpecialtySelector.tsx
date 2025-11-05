"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { colors } from "@/config/colors";

interface SpecialtyOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
}

interface SpecialtySelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  options: readonly SpecialtyOption[];
  error?: string;
}

export function SpecialtySelector({ selected, onChange, options, error }: SpecialtySelectorProps) {
  const toggleSpecialty = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleSpecialty(option.value)}
              className="relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md"
              style={{
                backgroundColor: isSelected ? option.colors.bg : 'white',
                borderColor: isSelected ? option.colors.border : colors.neutral[200],
                color: isSelected ? option.colors.text : colors.neutral[700],
              }}
            >
              {/* Checkmark */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: option.colors.text,
                  }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl mb-2">{option.icon}</div>

              {/* Label */}
              <div className="font-semibold text-sm mb-1">{option.label}</div>

              {/* Description */}
              <div
                className="text-xs"
                style={{
                  color: isSelected ? option.colors.text : colors.neutral[500],
                }}
              >
                {option.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selected.length} especialidad{selected.length !== 1 ? "es" : ""} seleccionada
          {selected.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm font-medium" style={{ color: colors.error[600] }}>
          {error}
        </p>
      )}
    </div>
  );
}
