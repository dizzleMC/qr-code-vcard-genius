
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, QrCode, Settings, HelpCircle, ChevronRight } from "lucide-react";

export const PremiumLayout = ({ children, currentStep }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8f9fc]">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-gray-200">
          <SidebarContent>
            <div className="p-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-md bg-accent p-1">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-xl">yourVcard.de</span>
              </Link>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Home" isActive={false}>
                      <Link to="/">
                        <Home size={20} />
                        <span>Einzel QR-Code</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Premium" isActive={true}>
                      <Link to="/premium">
                        <QrCode size={20} />
                        <span>Premium Bulk-Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Bulk Generator</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentStep === 1} tooltip="Daten importieren">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent mr-2">
                        1
                      </div>
                      <span>Daten importieren</span>
                      {currentStep > 1 && <ChevronRight className="ml-auto" size={16} />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentStep === 2} tooltip="Template anpassen" aria-disabled={currentStep < 2}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 2 ? "bg-accent/10 text-accent" : "bg-gray-200 text-gray-500"} mr-2`}>
                        2
                      </div>
                      <span className={currentStep < 2 ? "text-gray-500" : ""}>Template anpassen</span>
                      {currentStep > 2 && <ChevronRight className="ml-auto" size={16} />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentStep === 3} tooltip="QR-Codes generieren" aria-disabled={currentStep < 3}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 3 ? "bg-accent/10 text-accent" : "bg-gray-200 text-gray-500"} mr-2`}>
                        3
                      </div>
                      <span className={currentStep < 3 ? "text-gray-500" : ""}>QR-Codes generieren</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarFooter className="mt-auto">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Hilfe" asChild>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                          <HelpCircle size={20} />
                          <span>Hilfe & Support</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <header className="border-b border-gray-200 bg-white shadow-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-gray-900">QR-Code Bulk Generator</h1>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="mx-auto w-full max-w-5xl space-y-8">
              {children}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <GuideSection />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
