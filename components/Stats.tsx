'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Globe,
  Database,
  ArrowUp,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    destinations: 0,
    dataPoints: 0
  });

  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    {
      label: "Global Destinations",
      value: "500+",
      numericValue: 500,
      icon: Globe,
      change: "+12.5%",
      description: "Countries & regions",
      // Updated: Use primary/accent gradient
      color: "from-primary to-accent"
    },
    {
      label: "Time Coverage",
      value: "2015 – 2024",
      icon: Calendar,
      change: "10 Years",
      description: "Historical dataset span",
      // Keep purple/pink for variety
      color: "from-purple-500 to-pink-500"
    },
    {
      label: "Data Points",
      value: "1M+",
      numericValue: 1000,
      icon: Database,
      change: "+45.2%",
      description: "Tourism data records",
      // Keep teal/emerald for success/growth
      color: "from-teal-500 to-emerald-500"
    },
    {
      label: "Revenue Impact",
      value: "$2.5B",
      icon: BarChart3,
      change: "+32.8%",
      description: "Revenue analyzed",
      // Keep orange/red for revenue/warning
      color: "from-orange-500 to-red-500"
    }
  ];

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

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        destinations: Math.min(Math.round(500 * progress), 500),
        dataPoints: Math.min(Math.round(1000 * progress), 1000)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 mb-4">
            {/* Updated: primary icon color */}
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-300">
              Tourism Intelligence Overview
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {/* Updated: gradient from primary to accent */}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligence
            </span>{' '}
            at a Glance
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Key performance indicators derived from global tourism revenue analysis (2015–2024)
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            const displayValue =
              stat.label === "Global Destinations"
                ? `${counts.destinations}+`
                : stat.label === "Data Points"
                ? `${counts.dataPoints}K+`
                : stat.value;

            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Updated: hover shadow with primary */}
                <div className="h-full flex flex-col justify-between bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">

                  {/* Icon - using stat.color gradients */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-2.5 mb-4`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Value */}
                  <div className="min-h-[72px] text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    {displayValue}
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>

                  {/* Label */}
                  <div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stat.description}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}