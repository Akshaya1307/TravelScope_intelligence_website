"use client";

import { useState } from "react";
import { MessageCircle, X, HelpCircle, Mail, BarChart3, Filter } from "lucide-react";

export default function HelpChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeResponse, setActiveResponse] = useState<string | null>(null);

  const handleOptionClick = (type: string) => {
    switch (type) {
      case "region":
        setActiveResponse(
          "To explore a region, scroll to the Regional Performance Explorer section and click on any bar in the chart."
        );
        break;

      case "filters":
        setActiveResponse(
          "Use the Year and Season filters at the top of the Regional Explorer to refine tourism insights dynamically."
        );
        break;

      case "dashboard":
        setActiveResponse(
          "The main analytics dashboard is located above the explorer section. It displays embedded Power BI reports."
        );
        break;

      case "contact":
        setActiveResponse(
          "For further assistance, please navigate to the Contact section in the footer or About page."
        );
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
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/60">
            <div className="flex items-center gap-2 text-white font-semibold">
              <HelpCircle size={18} />
              TravelScope Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-sm text-slate-300">

            {!activeResponse && (
              <>
                <p className="text-slate-400">Hi! How can I help you today?</p>

                <button
                  onClick={() => handleOptionClick("region")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  <BarChart3 size={16} />
                  Can't find a region?
                </button>

                <button
                  onClick={() => handleOptionClick("filters")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  <Filter size={16} />
                  Need help using filters?
                </button>

                <button
                  onClick={() => handleOptionClick("dashboard")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  <BarChart3 size={16} />
                  Where is the main dashboard?
                </button>

                <button
                  onClick={() => handleOptionClick("contact")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  <Mail size={16} />
                  Contact support
                </button>
              </>
            )}

            {activeResponse && (
              <div className="space-y-3">
                <p>{activeResponse}</p>
                <button
                  onClick={() => setActiveResponse(null)}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  ← Back to options
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}