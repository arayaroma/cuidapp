import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface RequirementsInputProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
  maxItems?: number;
  placeholder?: string;
}

export function RequirementsInput({
  requirements,
  onChange,
  maxItems = 10,
  placeholder = "Ej: Experiencia con Alzheimer",
}: RequirementsInputProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() && requirements.length < maxItems) {
      onChange([...requirements, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={requirements.length >= maxItems}
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          size="icon"
          disabled={!input.trim() || requirements.length >= maxItems}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {requirements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <span>{req}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="hover:text-purple-900 transition-colors"
                aria-label="Eliminar requisito"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {requirements.length} de {maxItems} requisitos agregados
        {requirements.length === 0 && " (mínimo 1 requerido)"}
      </p>
    </div>
  );
}
