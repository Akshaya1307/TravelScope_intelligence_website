'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Target, 
  Brain,
  Sparkles
} from "lucide-react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const techStack = [
    'Power BI',
    'DAX',
    'SQL',
    'Next.js',
    'Tailwind',
    'TypeScript'
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      // Updated: background gradient
      className="relative py-24 bg-gradient-to-b from-background-mid to-background-dark border-t border-slate-800 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Updated: primary gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
        {/* Keep purple for visual variety */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
            {/* Updated: badge icon to primary */}
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-300">About TravelScope Intelligence</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-white">
            Enterprise Tourism Analytics Platform
          </h2>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            TravelScope Intelligence is a strategic business intelligence platform
            designed to evaluate global tourism performance, seasonal revenue uplift,
            and regional efficiency through KPI-driven analytics.
          </p>

          {/* Technology Stack */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Technology Stack
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  // Updated: hover effects to primary
                  className="px-4 py-1.5 bg-slate-800/60 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-primary/50 hover:text-primary transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Core Sections */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Vision - Updated to primary */}
          <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Vision
                </h3>
                <p className="text-slate-400">
                  Deliver actionable tourism intelligence by identifying seasonal revenue
                  growth patterns and optimizing strategic performance indicators.
                </p>
              </div>
            </div>
          </div>

          {/* Business Impact - Keep teal for variety */}
          <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-500/10 rounded-xl">
                <Briefcase className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Business Impact
                </h3>
                <p className="text-slate-400">
                  Enables stakeholders to identify high-performing regions,
                  measure volatility (2.55 index), and maximize revenue efficiency
                  across 5 continents.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Architecture - Keep purple for variety */}
          <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Technical Architecture
                </h3>
                <p className="text-slate-400">
                  Built using Power BI dashboards, DAX KPI engineering,
                  structured relational modeling, and deployed through a
                  modern Next.js + Tailwind frontend.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}