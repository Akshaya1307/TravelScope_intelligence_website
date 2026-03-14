'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  TrendingUp,
  Globe,
  Sparkles,
  Compass,
  Smile
} from 'lucide-react';

export default function Hero() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Updated: primary and accent background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/50 mb-8 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Updated: primary icon color */}
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-300">
              Global Tourism Intelligence
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Updated: gradient from primary to accent */}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TravelScope
            </span>
            <br />
            <span className="text-white">Intelligence</span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Strategic revenue analytics and tourism intelligence for global decision-making.
            Unlock data-driven insights to optimize travel performance.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Updated: primary button with primary/accent gradient and primary shadow */}
            <button
              onClick={scrollToDashboard}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center gap-2"
            >
              View Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="#insights"
              className="group px-8 py-4 border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              Explore Insights
            </Link>
          </div>

          {/* 4 Premium Metric Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto transition-all duration-700 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {[
              { icon: Globe, label: 'Destinations Analyzed', value: '500+' },
              { icon: Compass, label: 'Deep Regional Intelligence', value: 'KYD – Know Your Destination' },
              { icon: Smile, label: 'Ensures Happy Customers', value: 'Optimized Tourism Strategy' },
              { icon: TrendingUp, label: 'Data Points Processed', value: '1M+' }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                {/* Updated: hover gradient with primary/accent */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />

                {/* Updated: hover shadow with primary */}
                <div className="h-full bg-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800 group-hover:border-slate-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 text-center">

                  {/* Updated: primary icon color */}
                  <stat.icon className="w-6 h-6 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform duration-300" />

                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>

                  <div className="text-sm text-slate-400">
                    {stat.label}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-dark to-transparent pointer-events-none" />
    </section>
  );
}