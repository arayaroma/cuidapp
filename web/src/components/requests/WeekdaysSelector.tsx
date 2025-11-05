"use client";

import { Check } from "lucide-react";
import { colors } from "@/config/colors";

interface WeekdaysSelectorProps {
  value: string[];
  onChange: (weekdays: string[]) => void;
  error?: string;
}

const WEEKDAYS = [
  { value: "lunes", label: "Lun", fullLabel: "Lunes" },
  { value: "martes", label: "Mar", fullLabel: "Martes" },
  { value: "miercoles", label: "Mié", fullLabel: "Miércoles" },
  { value: "jueves", label: "Jue", fullLabel: "Jueves" },
  { value: "viernes", label: "Vie", fullLabel: "Viernes" },
  { value: "sabado", label: "Sáb", fullLabel: "Sábado" },
  { value: "domingo", label: "Dom", fullLabel: "Domingo" },
];

export function WeekdaysSelector({ value = [], onChange, error }: WeekdaysSelectorProps) {
  const toggleWeekday = (weekday: string) => {
    if (value.includes(weekday)) {
      onChange(value.filter((d) => d !== weekday));
    } else {
      onChange([...value, weekday]);
    }
  };

  const selectAll = () => {
    onChange(WEEKDAYS.map((d) => d.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs px-3 py-1 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: colors.primary[50],
              color: colors.primary[700],
            }}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs px-3 py-1 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: colors.neutral[100],
              color: colors.neutral[700],
            }}
          >
            Limpiar
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {value.length} día{value.length !== 1 ? "s" : ""} seleccionado{value.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((weekday) => {
          const isSelected = value.includes(weekday.value);
          return (
            <button
              key={weekday.value}
              type="button"
              onClick={() => toggleWeekday(weekday.value)}
              className="relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isSelected ? colors.primary[50] : "white",
                borderColor: isSelected ? colors.primary[500] : colors.neutral[200],
                color: isSelected ? colors.primary[700] : colors.neutral[600],
              }}
              title={weekday.fullLabel}
            >
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary[500] }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-xs font-bold">{weekday.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm" style={{ color: colors.error[600] }}>
          {error}
        </p>
      )}
    </div>
  );
}
