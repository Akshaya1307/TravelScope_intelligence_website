'use client';

import RegionExplorer from "./RegionExplorer";
import { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface Metrics {
  totalRevenue: number;
  activeRegions: number;
  avgStay: number;
  peakRevenue: number;
}

export default function DashboardSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshKey] = useState(0);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const POWER_BI_EMBED_LINK =
    "https://app.powerbi.com/reportEmbed?reportId=7f57ce51-2bda-47f0-b67e-45aade57a75d&autoAuth=true&ctid=3b0993d8-31db-4db6-b617-64ac193c7ace";

  // 🔥 CLEAN API FETCH
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/powerbi/metrics');
        const data = await res.json();

        console.log("CLEAN API DATA:", data);

        if (data) {
          setMetrics({
            totalRevenue: data.totalRevenue ?? 0,
            activeRegions: data.activeRegions ?? 0,
            avgStay: data.avgStay ?? 0,
            peakRevenue: data.peakSeasonRevenue ?? 0
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Metrics fetch failed:", error);
        setHasError(true);
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, [refreshKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const formatCurrency = (value: number) =>
    `₹ ${(value / 1_000_000_000).toFixed(1)}B`;

  return (
    <>
      {/* ================= MAIN DASHBOARD SECTION ================= */}
      <section
        id="dashboard"
        className="relative py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
              {/* Updated: primary icon color */}
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm text-slate-300">
                Live Analytics Dashboard
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-4 text-white">
              Interactive Analytics Dashboard
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Explore real-time tourism revenue and regional performance metrics.
            </p>
          </div>

          {/* IFRAME */}
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
                {/* Updated: primary color for spinner */}
                <div className="w-16 h-16 border-4 border-slate-700 border-t-primary rounded-full animate-spin" />
              </div>
            )}

            {hasError && !isLoading && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20 text-red-400">
                Failed to load dashboard
              </div>
            )}

            <iframe
              key={refreshKey}
              ref={iframeRef}
              title="Power BI Dashboard"
              width="100%"
              height="700"
              src={POWER_BI_EMBED_LINK}
              frameBorder="0"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          </div>

          {/* METRIC CARDS */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              label="Total Revenue"
              value={
                metrics
                  ? formatCurrency(metrics.totalRevenue)
                  : "Loading..."
              }
            />
            <MetricCard
              label="Active Regions"
              value={
                metrics
                  ? metrics.activeRegions.toString()
                  : "Loading..."
              }
            />
            <MetricCard
              label="Avg. Stay"
              value={
                metrics
                  ? `${metrics.avgStay.toFixed(2)} days`
                  : "Loading..."
              }
            />
            <MetricCard
              label="Peak Revenue"
              value={
                metrics
                  ? formatCurrency(metrics.peakRevenue)
                  : "Loading..."
              }
            />
          </div>

          <div className="text-center mt-8">
            <a
              href={POWER_BI_EMBED_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              View full dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= REGION EXPLORER ================= */}
      <section className="relative py-24 bg-gradient-to-b from-background-dark via-background-mid to-background-dark border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Regional Performance Explorer
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Drill into individual destination regions and explore detailed tourism insights.
            </p>
          </div>

          <RegionExplorer />
        </div>
      </section>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-lg p-5 border border-slate-800">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}