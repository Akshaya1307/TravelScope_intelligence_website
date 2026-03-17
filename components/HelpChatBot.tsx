"use client";

import { useState } from "react";
import { MessageCircle, X, HelpCircle, Mail, BarChart3, Filter, LayoutDashboard, MapPin } from "lucide-react";

export default function HelpChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeResponse, setActiveResponse] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false); // Close chat after navigation
    }
  };

  const handleOptionClick = (type: string) => {
    switch (type) {
      case "region":
        scrollToSection("region-explorer");
        setActiveResponse("Navigating to Region Performance Explorer...");
        break;

      case "filters":
        scrollToSection("region-explorer");
        setActiveResponse("Scrolling to the filter section in Region Explorer...");
        break;

      case "dashboard":
        scrollToSection("dashboard");
        setActiveResponse("Taking you to the main analytics dashboard...");
        break;

      case "contact":
        scrollToSection("contact");
        setActiveResponse("Navigating to the footer contact section...");
        break;

      case "insights":
        scrollToSection("insights");
        setActiveResponse("Moving to Strategic Insights section...");
        break;

      case "about":
        scrollToSection("about");
        setActiveResponse("Taking you to the About section...");
        break;

      default:
        setActiveResponse(null);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-light text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Open help assistant"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-background-card backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-dark/80">
            <div className="flex items-center gap-2 text-text-primary font-semibold">
              <HelpCircle size={18} className="text-primary" />
              TravelScope Assistant
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-sm text-text-secondary max-h-96 overflow-y-auto">

            {!activeResponse && (
              <>
                <p className="text-text-primary font-medium mb-2">Hi! How can I help you today?</p>

                <button
                  onClick={() => handleOptionClick("region")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <MapPin size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">Can't find a region?</span>
                  <span className="text-xs text-primary">→</span>
                </button>

                <button
                  onClick={() => handleOptionClick("filters")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <Filter size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">Need help using filters?</span>
                  <span className="text-xs text-primary">→</span>
                </button>

                <button
                  onClick={() => handleOptionClick("dashboard")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <LayoutDashboard size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">Where is the main dashboard?</span>
                  <span className="text-xs text-primary">→</span>
                </button>

                <button
                  onClick={() => handleOptionClick("insights")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <BarChart3 size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">View strategic insights</span>
                  <span className="text-xs text-primary">→</span>
                </button>

                <button
                  onClick={() => handleOptionClick("about")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <HelpCircle size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">Learn about TravelScope</span>
                  <span className="text-xs text-primary">→</span>
                </button>

                <button
                  onClick={() => handleOptionClick("contact")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-dark/50 hover:bg-background-dark border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <Mail size={16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="flex-1">Contact support</span>
                  <span className="text-xs text-primary">→</span>
                </button>
              </>
            )}

            {activeResponse && (
              <div className="space-y-4">
                <div className="p-3 bg-background-dark/50 rounded-lg border border-primary/20 text-text-secondary">
                  <p className="text-sm">{activeResponse}</p>
                </div>
                <button
                  onClick={() => setActiveResponse(null)}
                  className="text-primary hover:text-primary-light text-xs flex items-center gap-1 transition-colors"
                >
                  ← Back to options
                </button>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-background-dark/30">
            <p className="text-xs text-text-muted text-center">
              Need more help? Use the contact option above
            </p>
          </div>
        </div>
      )}
    </>
  );
}