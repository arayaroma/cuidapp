import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description: string;
  color?: "green" | "blue" | "yellow" | "red" | "purple" | "pink" | "orange" | "gray";
  customColors?: {
    color: string;
    bg: string;
    border: string;
    hover: string;
    text: string;
  };
}

interface EnhancedRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  name: string;
}

export function EnhancedRadioGroup({
  value,
  onValueChange,
  options,
  name,
}: EnhancedRadioGroupProps) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const colors = option.customColors;

        return (
          <label
            key={option.value}
            htmlFor={`${name}-${option.value}`}
            className={cn(
              "relative flex items-start space-x-3 p-4 border-2 rounded-lg transition-all cursor-pointer",
              "hover:shadow-md"
            )}
            style={{
              backgroundColor: isSelected ? colors?.bg : "#FFFFFF",
              borderColor: isSelected ? colors?.border : "#E5E7EB",
            }}
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="mt-1"
            />
            <div className="flex-1">
              <span
                className="font-medium block mb-0.5"
                style={{
                  color: isSelected ? colors?.text : "#111827",
                }}
              >
                {option.label}
              </span>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </label>
        );
      })}
    </RadioGroup>
  );
}
