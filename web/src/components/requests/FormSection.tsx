import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface FormSectionProps {
  title: string;
  description?: string;
  step?: number;
  totalSteps?: number;
  isCompleted?: boolean;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  step,
  totalSteps,
  isCompleted = false,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {step && totalSteps && (
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <span>{step}</span>
            )}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {step && totalSteps && (
              <span className="text-xs text-muted-foreground">
                Paso {step} de {totalSteps}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-14 space-y-4">{children}</div>
    </div>
  );
}
