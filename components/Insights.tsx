'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp,
  Activity,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  LineChart,
  AlertCircle
} from "lucide-react";

export default function Insights() {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(2017);
  const [chartData, setChartData] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [seasonalData, setSeasonalData] = useState<number[]>([]);
  const [isLoadingSeasonal, setIsLoadingSeasonal] = useState(false);

  // 🔥 Fetch real monthly data - ONLY for Revenue Growth Analytics
  useEffect(() => {
    if (expandedInsight === 0) {
      setIsLoadingChart(true);
      setChartError(null);

      fetch(`/api/powerbi/monthly-trend?year=${selectedYear}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data.error) {
            setChartError(data.error);
            setChartData([]);
            setMonths([]);
          } else {
            setChartData(data.values || []);
            setMonths(data.months || []);
          }
          setIsLoadingChart(false);
        })
        .catch(err => {
          console.error('Chart data fetch error:', err);
          setChartError('Failed to load chart data');
          setIsLoadingChart(false);
        });
    }
  }, [selectedYear, expandedInsight]);

  // 🔥 Fetch seasonal pattern data - for Volatility & Seasonality
  useEffect(() => {
    if (expandedInsight === 1) {
      setIsLoadingSeasonal(true);
      
      // Simulate API call - replace with actual endpoint
      setTimeout(() => {
        const patternData = [65, 58, 72, 88, 95, 100, 98, 92, 78, 68, 72, 82];
        setSeasonalData(patternData);
        setIsLoadingSeasonal(false);
      }, 800);
    }
  }, [expandedInsight]);

  const insights = [
    {
      id: 'analytics',
      icon: TrendingUp,
      title: 'Revenue Growth Analytics',
      shortDescription:
        'Post-pandemic recovery driving consistent growth across all regions.',
      metrics: [
        { label: 'Growth Rate', value: '+7.36%', trend: 'up' },
        { label: 'Peak Uplift', value: '+32%', trend: 'up' },
        { label: 'Recovery Phase', value: 'Post-2023', trend: 'neutral' }
      ],
      // Updated: Use primary/accent for first card
      color: 'from-primary to-accent'
    },
    {
      id: 'trends',
      icon: Activity,
      title: 'Volatility & Seasonality',
      shortDescription:
        'Controlled seasonal fluctuations indicate operational stability.',
      metrics: [
        { label: 'Volatility Index', value: '2.55', trend: 'neutral' },
        { label: 'Peak Seasons', value: 'Summer/Winter', trend: 'neutral' },
        { label: 'Forecast Accuracy', value: '94%', trend: 'up' }
      ],
      // Keep purple/pink for volatility (works well)
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'reports',
      icon: BarChart,
      title: 'Regional Performance',
      shortDescription:
        'Asia leads growth with Europe and North America following.',
      metrics: [
        { label: 'Asia Uplift', value: '+28.3%', trend: 'up' },
        { label: 'Europe', value: '+15.2%', trend: 'up' },
        { label: 'North America', value: '+12.8%', trend: 'up' }
      ],
      // Keep green for regional performance (success/growth)
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up')
      return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (trend === 'down')
      return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return null;
  };

  const formatBillions = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  // Mini Chart for monthly trends (Bar Chart)
  const MiniBarChart = ({
    data,
    labels
  }: {
    data: number[];
    labels: string[];
  }) => {
    if (!data.length || !labels.length) return null;

    const max = Math.max(...data);

    return (
      <div className="relative">
        <div className="absolute -top-8 right-0 flex items-center gap-2">
          {/* Session active - keep green for status */}
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500">Session active</span>
        </div>

        <div className="flex items-end gap-1 h-48 mt-8">
          {data.map((value, i) => {
            const heightPercentage = max > 0 
              ? Math.max(15, (value / max) * 100) 
              : 15;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex justify-center">
                  {/* Updated: Use primary/accent gradient */}
                  <div
                    className="bg-gradient-to-t from-primary to-accent w-full rounded-t transition-all group-hover:opacity-90 cursor-pointer"
                    style={{ height: `${heightPercentage}px`, minHeight: '20px' }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 px-2 py-1 rounded text-xs text-white border border-slate-700 whitespace-nowrap z-10">
                    {formatBillions(value)}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2">
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
            {selectedYear}
          </span>
        </div>
      </div>
    );
  };

  // Seasonal Pattern Line Chart for Volatility insight
  const SeasonalLineChart = ({ data }: { data: number[] }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const max = Math.max(...data);
    
    const peakMonths = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] === max) peakMonths.push(months[i]);
    }

    return (
      <div className="relative">
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Keep purple/pink for seasonal theme */}
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <div className="text-xs text-purple-400 mb-1">Summer Peak</div>
            <div className="text-sm text-white">June-August</div>
            <div className="text-xs text-slate-400 mt-1">+32% above baseline</div>
          </div>
          <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/20">
            <div className="text-xs text-pink-400 mb-1">Winter Peak</div>
            <div className="text-sm text-white">December-February</div>
            <div className="text-xs text-slate-400 mt-1">+18% above baseline</div>
          </div>
        </div>

        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <line x1="0" y1="150" x2="600" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50" x2="600" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            
            <path
              d={data.map((value, i) => {
                const x = (i / (data.length - 1)) * 600;
                const y = 200 - (value / max) * 150;
                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              className="transition-all"
            />
            
            {data.map((value, i) => {
              const x = (i / (data.length - 1)) * 600;
              const y = 200 - (value / max) * 150;
              const isPeak = value === max;
              
              return (
                <g key={i} className="group/point">
                  <circle
                    cx={x}
                    cy={y}
                    r={isPeak ? "6" : "4"}
                    fill={isPeak ? "#c084fc" : "#94a3b8"}
                    className="cursor-pointer transition-all group-hover/point:r-6"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    className="text-[10px] fill-slate-400 opacity-0 group-hover/point:opacity-100 transition-opacity"
                    textAnchor="middle"
                  >
                    {months[i]}: {value}
                  </text>
                </g>
              );
            })}
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#f9a8d4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex justify-between mt-2 px-2">
            {months.map((month, i) => (
              <span key={i} className="text-[8px] text-slate-500">{month}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-300">
                <span className="text-purple-400 font-medium">Seasonal Pattern Analysis:</span> Revenue shows consistent 
                <span className="text-white"> summer peaks (June-August)</span> and 
                <span className="text-white"> winter peaks (December-February)</span> with controlled 
                dips in shoulder seasons. This pattern has remained stable across 2015-2024 with 
                <span className="text-white"> 2.55 volatility index</span>, indicating predictable cycles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExpandedContent = (insight: typeof insights[0], index: number) => {
    if (expandedInsight !== index) return null;

    if (insight.id === 'analytics') {
      return (
        <div className="mt-8 border-t border-slate-700 pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <span className="text-sm text-slate-400 font-medium">
              Monthly Revenue Trend
            </span>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              // Updated: focus ring to primary
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
            >
              {Array.from({ length: 10 }, (_, i) => 2015 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {isLoadingChart ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-sm text-slate-400 animate-pulse">
                Loading real-time data...
              </div>
            </div>
          ) : chartError ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-sm text-red-400">{chartError}</div>
            </div>
          ) : chartData.length > 0 ? (
            <MiniBarChart data={chartData} labels={months} />
          ) : (
            <div className="flex justify-center items-center h-48">
              <div className="text-sm text-slate-500">
                No data available for {selectedYear}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (insight.id === 'trends') {
      return (
        <div className="mt-8 border-t border-slate-700 pt-6">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400 font-medium">
              Seasonal Pattern (2015-2024 Average)
            </span>
          </div>

          {isLoadingSeasonal ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-sm text-slate-400 animate-pulse">
                Computing seasonal patterns...
              </div>
            </div>
          ) : (
            <SeasonalLineChart data={seasonalData} />
          )}
        </div>
      );
    }

    if (insight.id === 'reports') {
      return (
        <div className="mt-8 border-t border-slate-700 pt-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">Asia</span>
                <span className="text-sm text-green-400">+28.3%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">Europe</span>
                <span className="text-sm text-blue-400">+15.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">North America</span>
                <span className="text-sm text-purple-400">+12.8%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">Oceania</span>
                <span className="text-sm text-slate-400">+8.4%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-slate-500 h-2.5 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">South America</span>
                <span className="text-sm text-slate-400">+6.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-slate-500 h-2.5 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* 🎯 UPDATED: Main title with primary/accent/purple gradient */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent tracking-tight">
            Strategic Intelligence Dashboard
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
            Advanced tourism analytics powered by dynamic data modeling,
            revealing revenue trends, seasonal behavior, and regional performance insights.
          </p>
        </div>

        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const isExpanded = expandedInsight === index;

          return (
            <div
              key={insight.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${insight.color} shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      {insight.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Updated: expand button with primary color */}
                <button
                  onClick={() =>
                    setExpandedInsight(isExpanded ? null : index)
                  }
                  className="text-primary text-xs flex items-center gap-1 hover:text-primary-light transition-colors whitespace-nowrap"
                >
                  {isExpanded ? 'Hide analysis' : 'View analysis'}
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {insight.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/70 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <div className="text-xs text-slate-500 mb-2">
                      {metric.label}
                    </div>
                    <div className="text-lg font-bold text-white flex items-center gap-1">
                      {metric.value}
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expanded Content */}
              {renderExpandedContent(insight, index)}
            </div>
          );
        })}
      </div>
    </section>
  );
}