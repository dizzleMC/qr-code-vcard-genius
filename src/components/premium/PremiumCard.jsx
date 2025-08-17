import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const PremiumCard = ({ 
  children, 
  title, 
  description, 
  icon: Icon, 
  className,
  ...props 
}) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden",
        "hover:shadow-glow/30 hover:-translate-y-1",
        "transition-all duration-500 ease-out",
        className
      )}
      {...props}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {title && (
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-gradient-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1 text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="relative z-10">
        {children}
      </CardContent>
    </Card>
  );
};