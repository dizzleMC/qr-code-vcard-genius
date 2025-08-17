import { Check, Upload, Settings, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Import",
    description: "Daten importieren",
    icon: Upload,
  },
  {
    id: 2,
    title: "Template",
    description: "Design anpassen",
    icon: Settings,
  },
  {
    id: 3,
    title: "Generate",
    description: "QR-Codes erstellen",
    icon: Download,
  },
];

export const PremiumStepIndicator = ({ currentStep, completedSteps = [] }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2 z-0">
          <div 
            className="h-full bg-gradient-primary transition-all duration-700 ease-out"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "relative z-10 flex flex-col items-center group transition-all duration-300",
                isActive && "scale-110"
              )}
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-sm",
                  isCompleted
                    ? "bg-gradient-primary border-primary text-primary-foreground shadow-glow"
                    : isActive
                    ? "bg-gradient-card border-primary text-primary shadow-soft animate-glow"
                    : "bg-glass-bg border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>

              {/* Step info */}
              <div className="mt-4 text-center">
                <div
                  className={cn(
                    "font-semibold text-sm transition-colors duration-300",
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </div>
                <div
                  className={cn(
                    "text-xs mt-1 transition-colors duration-300",
                    isActive
                      ? "text-primary/80"
                      : "text-muted-foreground"
                  )}
                >
                  {step.description}
                </div>
              </div>

              {/* Active indicator pulse */}
              {isActive && (
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};