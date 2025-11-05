"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors } from "@/config/colors";

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: readonly string[];
  maxItems?: number;
  error?: string;
}

export function ChipInput({
  value,
  onChange,
  placeholder = "Escribe y presiona Enter...",
  suggestions = [],
  maxItems = 10,
  error,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addItem = (item: string) => {
    const trimmedItem = item.trim();
    if (trimmedItem && !value.includes(trimmedItem) && value.length < maxItems) {
      onChange([...value, trimmedItem]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeItem(value.length - 1);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !value.includes(s) &&
      s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Chips Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border"
              style={{
                backgroundColor: colors.primary[50],
                color: colors.primary[700],
                borderColor: colors.primary[200],
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input with suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            disabled={value.length >= maxItems}
            className={error ? "border-red-500" : ""}
          />
          {inputValue && (
            <Button
              type="button"
              size="sm"
              onClick={() => addItem(inputValue)}
              disabled={value.length >= maxItems}
              style={{ background: colors.gradients.primary }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
            style={{ borderColor: colors.neutral[200] }}
          >
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addItem(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length} / {maxItems} agregados
        </span>
        {value.length < maxItems && (
          <span className="text-xs" style={{ color: colors.primary[600] }}>
            Presiona Enter para agregar
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm font-medium" style={{ color: colors.error[600] }}>
          {error}
        </p>
      )}
    </div>
  );
}
