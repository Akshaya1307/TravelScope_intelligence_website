'use client';

import RegionExplorer from "./RegionExplorer";
import { useState, useEffect } from 'react';
import {
  BarChart3,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle
} from 'lucide-react';

/* ================= TYPES ================= */

interface RegionData {
  region: string;
  totalRevenue: number;
  avgStay: number;
}

interface Metrics {
  totalRevenue: number;
  activeRegions: number;
  avgStay: number;
  peakSeasonRevenue: number;
}

/* ================= STATIC TOURISM DATA ================= */

const tourismData: Record<string, { place: string; description: string }[]> = {
  Asia: [
    { place: "Bali, Indonesia", description: "Tropical beaches, temples, and rich cultural heritage." },
    { place: "Tokyo, Japan", description: "Fusion of futuristic innovation and traditional culture." },
    { place: "Bangkok, Thailand", description: "Vibrant nightlife, temples, and street food." },
    { place: "Maldives", description: "Luxury island resorts and crystal-clear waters." },
    { place: "Dubai, UAE", description: "Iconic skyline and luxury tourism experiences." },
    { place: "Singapore", description: "Modern city with world-class attractions." },
    { place: "Seoul, South Korea", description: "Pop culture hub with deep-rooted history." },
    { place: "Phuket, Thailand", description: "Beach destination with vibrant tourism." },
    { place: "Kyoto, Japan", description: "Historic temples and cherry blossom views." },
    { place: "Goa, India", description: "Beach paradise with Portuguese influence." }
  ],
  Europe: [
    { place: "Paris, France", description: "Home of the Eiffel Tower and romantic charm." },
    { place: "Rome, Italy", description: "Ancient ruins and rich Roman history." },
    { place: "Barcelona, Spain", description: "Gaudí architecture and Mediterranean vibes." },
    { place: "Swiss Alps, Switzerland", description: "Scenic mountain landscapes and skiing." },
    { place: "Amsterdam, Netherlands", description: "Canals, museums, and vibrant culture." },
    { place: "London, UK", description: "Historic landmarks and royal heritage." },
    { place: "Santorini, Greece", description: "Iconic sunsets and whitewashed buildings." },
    { place: "Prague, Czech Republic", description: "Fairytale architecture and castles." },
    { place: "Vienna, Austria", description: "Classical music and imperial palaces." },
    { place: "Budapest, Hungary", description: "Thermal baths and historic bridges." }
  ],
  "North America": [
    { place: "New York, USA", description: "The city that never sleeps." },
    { place: "Las Vegas, USA", description: "Global entertainment capital." },
    { place: "Toronto, Canada", description: "Modern skyline and diverse culture." },
    { place: "Cancun, Mexico", description: "Beach resorts and Mayan ruins." },
    { place: "California, USA", description: "Hollywood and scenic coastlines." },
    { place: "Vancouver, Canada", description: "Mountains meet ocean beauty." },
    { place: "Orlando, USA", description: "Theme park capital of the world." },
    { place: "Chicago, USA", description: "Architectural excellence and skyline views." },
    { place: "Montreal, Canada", description: "European charm in North America." },
    { place: "Hawaii, USA", description: "Volcanic islands and beaches." }
  ],
  "South America": [
    { place: "Rio de Janeiro, Brazil", description: "Carnival and Christ the Redeemer." },
    { place: "Machu Picchu, Peru", description: "Ancient Incan wonder of the world." },
    { place: "Patagonia, Argentina", description: "Dramatic landscapes and glaciers." },
    { place: "Buenos Aires, Argentina", description: "Tango and European-style charm." },
    { place: "Santiago, Chile", description: "Mountain views and vineyards." },
    { place: "Lima, Peru", description: "World-famous culinary destination." },
    { place: "Galapagos Islands", description: "Unique wildlife ecosystem." },
    { place: "Cartagena, Colombia", description: "Colorful colonial beauty." },
    { place: "Cusco, Peru", description: "Gateway to Machu Picchu." },
    { place: "Salvador, Brazil", description: "Afro-Brazilian culture and beaches." }
  ],
  Oceania: [
    { place: "Sydney, Australia", description: "Opera House and harbour views." },
    { place: "Melbourne, Australia", description: "Cultural capital of Australia." },
    { place: "Queenstown, New Zealand", description: "Adventure tourism hub." },
    { place: "Great Barrier Reef", description: "World’s largest coral reef system." },
    { place: "Auckland, New Zealand", description: "City of sails." },
    { place: "Gold Coast, Australia", description: "Surf beaches and theme parks." },
    { place: "Tasmania, Australia", description: "Untouched natural beauty." },
    { place: "Fiji", description: "Luxury tropical island escapes." },
    { place: "Wellington, NZ", description: "Creative and cultural capital." },
    { place: "Cairns, Australia", description: "Gateway to the reef." }
  ]
};

/* ================= COMPONENT ================= */

export default function DashboardSection() {

  const POWER_BI_EMBED_LINK =
    "https://app.powerbi.com/view?r=eyJrIjoiZmVlZDQ2OGUtMmRmMC00OThhLWE1MzgtMjU3NmI4YmRmNDgxIiwidCI6IjhmYWQ5NzYxLWZhZGItNDFiNi04YTFkLWRjMDVkNWRjNGY5YiJ9";

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  /* ===== FETCH METRICS ===== */
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/powerbi/metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }
    fetchMetrics();
  }, []);

  /* ===== FETCH REGIONS ===== */
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/powerbi/regions")
      .then(res => res.json())
      .then((data: any[]) => {
        console.log("Raw API data:", data);
        
        const formatted: RegionData[] = data.map((item) => {
          const revenue = item.TotalRevenue || item["[TotalRevenue]"] || 0;
          const avgStay = item.AvgStay || item["[AvgStay]"] || 0;
          
          return {
            region: item["regenerated_large_travel_dataset[destination_region]"] || "Unknown",
            totalRevenue: Number(revenue) || 0,
            avgStay: Number(avgStay) || 0
          };
        });

        setRegions(formatted);

        if (formatted.length > 0) {
          setSelectedRegion(formatted[0].region);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching region data:", error);
        setIsLoading(false);
      });
  }, []);

  /* ===== SELECTED DATA ===== */
  const selectedData = regions.find(r => r.region === selectedRegion);

  /* ===== FORECAST ===== */
  const growthRate = selectedData && !isNaN(selectedData.avgStay) 
    ? 8 + (selectedData.avgStay * 0.5) 
    : 0;
    
  const forecastRevenue = selectedData && !isNaN(selectedData.totalRevenue) && !isNaN(growthRate)
    ? selectedData.totalRevenue * (1 + growthRate / 100)
    : 0;

  const estimatedCost = !isNaN(forecastRevenue) ? forecastRevenue * 0.65 : 0;
  const estimatedProfit = !isNaN(forecastRevenue) && !isNaN(estimatedCost) 
    ? forecastRevenue - estimatedCost 
    : 0;
  const profitMargin = !isNaN(forecastRevenue) && forecastRevenue > 0
    ? (estimatedProfit / forecastRevenue) * 100
    : 0;

  const formatCurrency = (value: number) => {
    if (isNaN(value) || value === 0) return "₹ 0B";
    return `₹ ${(value / 1_000_000_000).toFixed(2)}B`;
  };

  if (isLoading) {
    return (
      <section className="relative py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-text-secondary">Loading dashboard data...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* MAIN DASHBOARD */}
      <section
        id="dashboard"
        className="relative py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-card/50 border border-border mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">
                Live Analytics Dashboard
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-wide mb-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-orange-400">
                Interactive Analytics
              </span>{" "}
              <span className="text-white">
                Dashboard
              </span>
            </h2>
          </div>

          {/* POWER BI - REMOVED WHITE BACKGROUND */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl mb-12 bg-transparent">
            <iframe
              title="Power BI Dashboard"
              width="100%"
              height="700"
              src={POWER_BI_EMBED_LINK}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              style={{
                backgroundColor: "transparent",
                border: "none",
                display: "block"
              }}
            />
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            <MetricCard label="Total Revenue" value={metrics ? formatCurrency(metrics.totalRevenue) : "—"} />
            <MetricCard label="Active Regions" value={metrics ? metrics.activeRegions.toString() : "—"} />
            <MetricCard label="Avg. Stay" value={metrics ? `${metrics.avgStay?.toFixed(2)} days` : "—"} />
            <MetricCard label="Peak Revenue" value={metrics ? formatCurrency(metrics.peakSeasonRevenue) : "—"} />
          </div>

          {/* REGIONAL INTELLIGENCE ENGINE */}
          <div className="bg-background-card/40 backdrop-blur-md border border-border rounded-2xl p-8 mb-12 text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-dark/50 border border-border mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">
                Continent-Level Strategic Analysis
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-orange-400">
                Regional Intelligence
              </span>{" "}
              <span className="text-white">
                Engine
              </span>
            </h2>

            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Compare year-over-year performance, forecast next-year revenue,
              analyze profitability, and identify high-performing tourism destinations
              across continents.
            </p>

            <div className="flex justify-center">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-6 py-3 rounded-xl bg-background-dark border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {regions.map((r) => (
                  <option key={`region-${r.region}`} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* FORECAST & PROFITABILITY CARDS */}
          {selectedData && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <InfoCard
                  title="Current Revenue"
                  value={formatCurrency(selectedData.totalRevenue)}
                  trend={growthRate}
                />

                <InfoCard
                  title="Forecast (Next Year)"
                  value={formatCurrency(forecastRevenue)}
                  trend={growthRate}
                />

                <InfoCard
                  title="Estimated Profit"
                  value={formatCurrency(estimatedProfit)}
                  trend={profitMargin}
                />
              </div>

              {/* TOP 10 PLACES */}
              {selectedRegion && tourismData[selectedRegion] && (
                <div className="mb-12">
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Top 10 Tourist Attractions in {selectedRegion}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {tourismData[selectedRegion].map((item, index) => (
                      <div
                        key={`${selectedRegion}-${item.place}-${index}`}
                        className="bg-background-card p-5 rounded-lg border border-border hover:border-primary/30 transition-colors"
                      >
                        <h4 className="text-primary font-semibold">
                          {item.place}
                        </h4>
                        <p className="text-text-secondary text-sm mt-2">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* View full dashboard link */}
          <div className="text-center mt-8">
            <a
              href={POWER_BI_EMBED_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              View full dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* REGION EXPLORER */}
      <section className="relative py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <RegionExplorer />
        </div>
      </section>
    </>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background-card/40 rounded-lg p-5 border border-border">
      <div className="text-sm text-text-secondary mb-1">{label}</div>
      <div className="text-xl font-bold text-text-primary">{value}</div>
    </div>
  );
}

function InfoCard({ title, value, trend }: { title: string; value: string; trend: number }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : AlertCircle;
  const color = trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-yellow-400";

  return (
    <div className="bg-background-card/40 backdrop-blur-md rounded-xl p-6 border border-border">
      <h4 className="text-text-secondary mb-2">{title}</h4>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className={`flex items-center gap-2 text-sm ${color}`}>
        <TrendIcon className="w-4 h-4" />
        <span>{trend > 0 ? "Positive Trend" : trend < 0 ? "Declining" : "Stable"}</span>
      </div>
    </div>
  );
}
