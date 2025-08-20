import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";
import { Sparkles, QrCode } from "lucide-react";
export const PremiumLayout = ({
  children
}) => {
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary-glow/5 relative overflow-hidden">
      {/* Floating orbs for premium feel */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-primary-glow/20 to-primary/10 rounded-full blur-3xl animate-float" style={{
      animationDelay: '1s'
    }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Premium Navigation */}
        <nav className="flex justify-center mb-12">
          <div className="flex items-center gap-8 bg-gradient-card backdrop-blur-sm border border-glass-border rounded-full px-8 py-4 shadow-glass">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 group">
              <QrCode className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Einzel QR-Code</span>
            </Link>
            <div className="w-px h-6 bg-border"></div>
            <Link to="/premium" className="flex items-center gap-2 text-primary font-semibold relative group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-primary">Premium Bulk-Generator</span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
            </Link>
          </div>
        </nav>
        
        {/* Premium Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Premium Features
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent mb-6 animate-slide-up">
            QR-Code Bulk Generator
          </h1>
          
          <p style={{
          animationDelay: '0.2s'
        }} className="text-xl text-muted-foreground leading-relaxed animate-fade-in my-[30px]">
            Erstellen Sie professionelle QR-Codes für mehrere Kontakte auf einmal mit 
            <span className="text-primary font-semibold"> Premium-Design</span> und erweiterten Features
          </p>
          
          {/* Feature highlights */}
          
        </div>
        
        {/* Premium Content Container */}
        <div className="animate-fade-in" style={{
        animationDelay: '0.6s'
      }}>
          {children}
        </div>
        
        {/* Premium Guide Section */}
        <div className="mt-20 animate-fade-in" style={{
        animationDelay: '0.8s'
      }}>
          <GuideSection />
        </div>
      </div>
    </div>;
};