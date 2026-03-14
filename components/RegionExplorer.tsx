"use client";

import { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { 
  Info, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  Filter,
  X,
  ChevronDown,
  Globe,
  DollarSign,
  Sun,
  CloudRain,
  Sparkles
} from "lucide-react";

/* ================= TYPES ================= */

interface RegionSeasonalData {
  region: string;
  baseRevenue: number;
  peakRevenue: number;
  offPeakRevenue: number;
  shoulderRevenue?: number;
}

interface RegionData {
  region: string;
  revenue: number;
  season: 'peak' | 'off-peak' | 'normal';
}

interface RegionDetails {
  revenueOverview: string;
  averageStay: string;
  peakSeason: string;
  offPeakSeason: string;
  bestTimeToVisit: string;
  resources: {
    name: string;
    url: string;
    description?: string;
  }[];
}

/* ================= STATIC DATA WITH REALISTIC SEASONAL VARIATION ================= */

const seasonalRegionData: RegionSeasonalData[] = [
  { 
    region: "Asia", 
    baseRevenue: 3200000,
    peakRevenue: 4800000,
    offPeakRevenue: 2100000,
    shoulderRevenue: 3800000
  },
  { 
    region: "Europe", 
    baseRevenue: 2800000,
    peakRevenue: 4200000,
    offPeakRevenue: 1500000,
    shoulderRevenue: 3100000
  },
  { 
    region: "North America", 
    baseRevenue: 2100000,
    peakRevenue: 3300000,
    offPeakRevenue: 1200000,
    shoulderRevenue: 2500000
  },
  { 
    region: "Oceania", 
    baseRevenue: 1500000,
    peakRevenue: 2400000,
    offPeakRevenue: 900000,
    shoulderRevenue: 1700000
  },
  { 
    region: "South America", 
    baseRevenue: 1200000,
    peakRevenue: 1900000,
    offPeakRevenue: 800000,
    shoulderRevenue: 1400000
  }
];

/* ================= REGION DETAILS WITH SEASONAL INFO ================= */

const regionDetailsMap: Record<string, RegionDetails> = {
  Asia: {
    revenueOverview: "Asia shows strong tourism-driven revenue with dramatic seasonal variation. Peak seasons see 50% higher revenue, while off-peak drops by 34% due to monsoon and extreme temperatures.",
    averageStay: "Visitors to Asia typically stay 5-9 days, with longer stays (10-14 days) during peak spring and autumn seasons.",
    peakSeason: "Peak seasons: Spring (March-May) and Autumn (September-November) with mild temperatures and cherry blossoms. Revenue peaks at $4.8M.",
    offPeakSeason: "Off-peak: Summer monsoon (June-August) and Winter cold (December-February) in northern regions. Revenue drops to $2.1M.",
    bestTimeToVisit: "Best times: March-May for Japan/Korea, November-February for Southeast Asia to avoid monsoon.",
    resources: [
      { name: "Visit Asia", url: "https://www.dookinternational.com/blog/best-countries-to-visit-in-asia/", description: "Official tourism board" },
      { name: "Facilities Provided", url: "https://www.tripadvisor.in/TripBuilder", description: "Comprehensive guide" },
      { name: "Top Asian Attractions", url: "https://landmarksarchitects.com/famous-architecture-in-asia/", description: "Must-see destinations" },
      { name: "Seasonal Travel Tips", url: "https://transrentals.in/blog/seasonal-travel-guide-best-destinations-every-season", description: "Best times to visit each region" }
    ]
  },
  Europe: {
    revenueOverview: "Europe's revenue is heavily concentrated in summer months, with peak season generating 50% more revenue than base. Winter sees a dramatic 46% drop except for Christmas markets.",
    averageStay: "Average stay: 4-8 days in shoulder seasons, extending to 10-14 days during summer peak.",
    peakSeason: "Peak season: June-August (summer) with revenue hitting $4.2M. December holidays also see mini-peaks.",
    offPeakSeason: "Off-peak: November-March (excluding December holidays). Revenue drops to $1.5M with limited attractions.",
    bestTimeToVisit: "Best times: May-June or September-October for pleasant weather and fewer crowds.",
    resources: [
      { name: "European Travel Commission", url: "https://www.viator.com/Europe/d6-ttd?m=33953&supag=1232553616119671&supca=676994599&supsc=kwd-77034959897084&supai=77034734770859&supdv=c&supnt=nt:o&suplp=157600&supli=&supti=kwd-77034959897084&tsem=true&supci=kwd-77034959897084&supkw=top%20places%20in%20europe%20to%20visit&gclid=33d330ccfc1319069ee05978e18405fb&gclsrc=3p.ds&msclkid=33d330ccfc1319069ee05978e18405fb" },
      { name: "Europe Facilities", url: "https://www.radissonhotels.com/en-us/" },
      { name: "European Heritage Sites", url: "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Western_Europe" },
      { name: "Watch Europe in Rail", url: "https://www.raileurope.com/destinations/passes/eurail-global-pass?gclid=98fd594f7382142d156b30fb6d560fed&gclsrc=3p.ds&msclkid=98fd594f7382142d156b30fb6d560fed&utm_source=bing&utm_medium=cpc&utm_campaign=INA%20-%20ENG%20-%20GOO%20-%20Eurail%20pass&utm_term=europass%20train%20map&utm_content=Competitor%20-%20EUROPASS", description: "When to visit each country" }
    ]
  },
  "North America": {
    revenueOverview: "North America sees 57% revenue increase during summer months, with significant drops in winter except for ski destinations.",
    averageStay: "Visitors typically stay 5-10 days, with extended 14-day trips during summer road trip season.",
    peakSeason: "Peak seasons: Summer (June-August) at $3.3M and Fall foliage (September-October) at $2.8M.",
    offPeakSeason: "Off-peak: Winter (December-March) at $1.2M, excluding ski resorts which have their own peak.",
    bestTimeToVisit: "Best times: Late spring (May) or early fall (September) for national parks.",
    resources: [
      { name: "Visit The USA", url: "https://www.kayak.co.in/United-States-Hotels.253.dc.html?sck=SEM&skipapp=true" },
      { name: "Parks Canada", url: "https://parks.canada.ca/index" },
      { name: "North America Road Trips", url: "https://www.lonelyplanet.com/articles/usa-best-road-trips" },
      { name: "National Park Seasons", url: "https://www.travel-experience-live.com/best-months-to-visit-national-parks-calendar/", description: "When to visit each park" }
    ]
  },
  Oceania: {
    revenueOverview: "Oceania experiences 60% revenue surge during December-February summer, with winter dropping by 40% due to colder weather in southern regions.",
    averageStay: "Visitors typically stay 7-14 days due to long-haul travel distances, extending to 21 days in peak summer.",
    peakSeason: "Peak seasons: December-February (summer) at $2.4M. Great for beaches and outdoor activities.",
    offPeakSeason: "Off-peak: June-August (winter) at $0.9M. Better for whale watching and skiing in NZ.",
    bestTimeToVisit: "Best times: March-May or September-November for mild weather and fewer crowds.",
    resources: [
      { name: "Tourism Australia", url: "https://www.tripadvisor.in/Attractions-g255055-Activities-Australia.html" },
      { name: "Tourism New Zealand", url: "https://www.tripadvisor.in/Attractions-g255104-Activities-New_Zealand.html" },
      { name: "Pacific Island Guide", url: "https://www.tripadvisor.in/Attractions-g150786-Activities-c57-t20-Pacific_Coast.html" },
      { name: "Seasonal Calendar", url: "https://www.journeysouthtravel.com/post/seasonal-guide-to-the-pacific-islands", description: "When to visit each island" }
    ]
  },
  "South America": {
    revenueOverview: "South America shows 58% revenue increase during December-February summer, with June-August winter dropping by 33% except for Andes ski regions.",
    averageStay: "Visitors typically stay 6-12 days exploring multiple countries, with longer stays during carnival season.",
    peakSeason: "Peak seasons: December-February (summer) at $1.9M. Includes Carnival in Rio and Patagonia trekking.",
    offPeakSeason: "Off-peak: June-August (winter) at $0.8M. Better for Amazon visits (dry season) and Andes skiing.",
    bestTimeToVisit: "Best times: Shoulder seasons (March-May, September-November) for balanced weather.",
    resources: [
      { name: "South America Travel", url: "https://www.southamerica.travel/" },
      { name: "Andes Explorer", url: "https://www.belmond.com/trains/south-america/peru/belmond-andean-explorer/", description: "Mountain trekking guides" },
      { name: "Amazon Tours", url: "https://www.rainforestexpeditions.com/?gdp=affilired&_affclk=adn%3A3817%3A%3A4c9bfdfa75dc13e7fb7f944e5532f532%3A8002y1", description: "Rainforest expeditions" },
      { name: "Seasonal Guide", url: "https://www.tourow.com/best-time-to-travel-to-south-america/", description: "When to visit each country" }
    ]
  },
  default: {
    revenueOverview: "This region shows significant seasonal variation in tourism revenue.",
    averageStay: "Visitors typically stay 4-7 days depending on season and travel purpose.",
    peakSeason: "Peak travel season aligns with favorable climate conditions and major holidays.",
    offPeakSeason: "Off-peak season sees reduced tourism due to weather or fewer events.",
    bestTimeToVisit: "Shoulder seasons often offer the best balance of weather and crowds.",
    resources: [
      { name: "Official Tourism Board", url: "#" }
    ]
  }
};

/* ================= CUSTOM TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const seasonData = seasonalRegionData.find(d => d.region === label);
    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl min-w-[200px]">
        <p className="font-semibold text-white text-lg">{label}</p>
        {/* Updated: revenue color to primary */}
        <p className="text-primary mt-1 text-xl font-bold">
          ${payload[0].value.toLocaleString()}
        </p>
        {seasonData && (
          <div className="mt-3 pt-3 border-t border-slate-700 text-xs space-y-1">
            <p className="text-slate-400">Base revenue: <span className="text-white">${seasonData.baseRevenue.toLocaleString()}</span></p>
            <p className="text-green-400">Peak: <span className="text-white">${seasonData.peakRevenue.toLocaleString()}</span> (+{Math.round((seasonData.peakRevenue/seasonData.baseRevenue - 1)*100)}%)</p>
            <p className="text-orange-400">Off-peak: <span className="text-white">${seasonData.offPeakRevenue.toLocaleString()}</span> ({Math.round((1 - seasonData.offPeakRevenue/seasonData.baseRevenue)*100)}% drop)</p>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">Click for detailed insights</p>
      </div>
    );
  }
  return null;
};

/* ================= MAIN COMPONENT ================= */

export default function RegionExplorer() {
  /* ===== STATE ===== */
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  /* ===== YEAR LIST (2015-2024) ===== */
  const years = Array.from({ length: 10 }, (_, i) => (2015 + i).toString());

  /* ===== REALISTIC SEASONAL FILTER LOGIC ===== */
  const filteredData = useMemo(() => {
    const yearIndex = parseInt(selectedYear) - 2015;
    const yearMultiplier = 1 + (yearIndex * 0.02);

    return seasonalRegionData.map(region => {
      let revenue = region.baseRevenue;
      
      if (selectedSeason === "Peak") {
        revenue = region.peakRevenue;
      } else if (selectedSeason === "Off-Peak") {
        revenue = region.offPeakRevenue;
      } else if (selectedSeason === "Shoulder") {
        revenue = region.shoulderRevenue || region.baseRevenue * 1.15;
      }
      
      revenue = Math.round(revenue * yearMultiplier);
      
      return {
        region: region.region,
        revenue,
        season: selectedSeason === "Peak" ? 'peak' : selectedSeason === "Off-Peak" ? 'off-peak' : 'normal'
      };
    });
  }, [selectedSeason, selectedYear]);

  /* ===== HANDLERS ===== */
  const handleMouseEnter = useCallback((data: any) => {
    if (data?.region) setHoveredRegion(data.region);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
  }, []);

  const handleBarClick = useCallback((data: any) => {
    if (data?.region) setSelectedRegion(data.region);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRegion(null);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedYear("2024");
    setSelectedSeason("All");
  }, []);

  /* ===== UTILITIES ===== */
  const formatRevenue = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);

  const totalRevenue = useMemo(() => 
    filteredData.reduce((sum, region) => sum + region.revenue, 0),
    [filteredData]
  );

  const selectedRegionSeasonal = useMemo(() => {
    if (!selectedRegion) return null;
    return seasonalRegionData.find(r => r.region === selectedRegion);
  }, [selectedRegion]);

  /* ===== RENDER ===== */
  return (
    <section
      id="region-explorer"
      className="scroll-mt-28 py-24 bg-gradient-to-b from-background-dark to-background-mid"
    >
      <div className="space-y-6 max-w-7xl mx-auto px-6">
        {/* Header with centered premium title - UPDATED */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 mb-4">
            {/* Updated: badge icon to primary */}
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-300">Regional Intelligence</span>
          </div>
          {/* Updated: main title gradient */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent tracking-tight">
            Regional Performance Explorer
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
            Drill into destination regions and explore detailed tourism intelligence,
            revenue patterns, and seasonal trends across global markets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'} transition-all duration-300`}>
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-xl">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-slate-400 block mb-2">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  // Updated: focus ring to primary
                  className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {years.map(year => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-slate-400 block mb-2">Seasonal Impact</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  // Updated: focus ring to primary
                  className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option>All Seasons (Base)</option>
                  <option>Peak</option>
                  <option>Shoulder</option>
                  <option>Off-Peak</option>
                </select>
              </div>

              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {(selectedYear !== "2024" || selectedSeason !== "All") && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                <span className="text-sm text-slate-400">Active filters:</span>
                {selectedYear !== "2024" && (
                  // Updated: year chip to primary
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30">
                    Year: {selectedYear}
                  </span>
                )}
                {selectedSeason !== "All" && (
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    selectedSeason === "Peak" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : selectedSeason === "Off-Peak"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : selectedSeason === "Shoulder"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : ""
                  }`}>
                    Season: {selectedSeason}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT - Chart */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Destination Region Revenue</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Total: {formatRevenue(totalRevenue)} • {selectedSeason !== "All" ? `${selectedSeason} Season` : 'Annual Base'}
                </p>
              </div>
              {selectedRegion && (
                <button
                  onClick={handleClearSelection}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition text-sm"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={filteredData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                onMouseLeave={handleMouseLeave}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                />
                <YAxis 
                  tickFormatter={formatRevenue} 
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  radius={[6, 6, 0, 0]}
                  onClick={handleBarClick}
                  onMouseEnter={handleMouseEnter}
                  className="cursor-pointer"
                >
                  {filteredData.map((entry, index) => {
                    // Updated: default to primary, selected to primary-light
                    let fillColor = "#4f46e5"; // primary
                    
                    if (selectedSeason === "Peak") {
                      fillColor = "#22c55e"; // keep green for peak
                    } else if (selectedSeason === "Off-Peak") {
                      fillColor = "#f97316"; // keep orange for off-peak
                    } else if (selectedSeason === "Shoulder") {
                      fillColor = "#eab308"; // keep yellow for shoulder
                    }
                    
                    if (selectedRegion === entry.region) {
                      fillColor = "#6366f1"; // primary-light
                    }
                    
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={fillColor}
                        fillOpacity={
                          hoveredRegion && hoveredRegion !== entry.region ? 0.3 : 1
                        }
                        className="transition-all duration-200"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend - keep semantic colors */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span className="text-slate-400">Base</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-400">Peak</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-slate-400">Shoulder</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-slate-400">Off-Peak</span>
              </div>
            </div>
          </div>

          {/* RIGHT - Details */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            {selectedRegion ? (
              <RegionDetails
                region={selectedRegion}
                details={regionDetailsMap[selectedRegion] || regionDetailsMap.default}
                seasonalData={selectedRegionSeasonal!}
                currentRevenue={filteredData.find(r => r.region === selectedRegion)?.revenue || 0}
                totalRevenue={totalRevenue}
                currentSeason={selectedSeason}
              />
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-300 text-lg font-medium">Select a Region</p>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Click on any bar in the chart to explore detailed insights about revenue, seasonal patterns, and travel resources
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards - Updated first card to primary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-xl font-semibold text-white">{formatRevenue(totalRevenue)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Regions</p>
                <p className="text-xl font-semibold text-white">{filteredData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Top Region</p>
                <p className="text-xl font-semibold text-white">
                  {filteredData.reduce((max, region) => 
                    region.revenue > max.revenue ? region : max
                  ).region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= REGION DETAILS ================= */

function RegionDetails({ 
  region, 
  details, 
  seasonalData,
  currentRevenue,
  totalRevenue,
  currentSeason
}: { 
  region: string; 
  details: RegionDetails;
  seasonalData: RegionSeasonalData;
  currentRevenue: number;
  totalRevenue: number;
  currentSeason: string;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["revenue"]));

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      newSet.has(section) ? newSet.delete(section) : newSet.add(section);
      return newSet;
    });
  }, []);

  const marketShare = ((currentRevenue / totalRevenue) * 100).toFixed(1);
  
  const peakDiff = ((seasonalData.peakRevenue / seasonalData.baseRevenue - 1) * 100).toFixed(0);
  const offPeakDiff = ((1 - seasonalData.offPeakRevenue / seasonalData.baseRevenue) * 100).toFixed(0);

  const sections = useMemo(() => [
    { 
      id: "revenue", 
      title: "Revenue Overview", 
      icon: TrendingUp, 
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">{details.revenueOverview}</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-xs text-slate-400">Base</p>
              <p className="text-sm font-semibold text-white">${(seasonalData.baseRevenue/1e6).toFixed(1)}M</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded text-center">
              <p className="text-xs text-green-400">Peak</p>
              <p className="text-sm font-semibold text-green-400">+{peakDiff}%</p>
            </div>
            <div className="bg-orange-500/10 p-2 rounded text-center">
              <p className="text-xs text-orange-400">Off-Peak</p>
              <p className="text-sm font-semibold text-orange-400">-{offPeakDiff}%</p>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: "stay", 
      title: "Average Stay Duration", 
      icon: Clock, 
      content: details.averageStay
    },
    { 
      id: "peak", 
      title: "Peak Season Trends", 
      icon: Calendar, 
      content: (
        <div className="space-y-2">
          <p className="text-slate-300">{details.peakSeason}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-400">Revenue: ${(seasonalData.peakRevenue/1e6).toFixed(1)}M</span>
          </div>
        </div>
      )
    },
    { 
      id: "offpeak", 
      title: "Off-Peak Season", 
      icon: CloudRain, 
      content: (
        <div className="space-y-2">
          <p className="text-slate-300">{details.offPeakSeason}</p>
          <div className="flex items-center space-x-2 mt-2">
            {/* Updated: off-peak icon to accent/blue? Keeping blue for rain */}
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">Revenue: ${(seasonalData.offPeakRevenue/1e6).toFixed(1)}M</span>
          </div>
        </div>
      )
    },
    {
      id: "resources",
      title: "Traveler Resources",
      icon: ExternalLink,
      content: (
        <ul className="space-y-2">
          {details.resources.map((resource, index) => (
            <li key={index}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all"
              >
                <div className="flex-1">
                  {/* Updated: resource links to primary */}
                  <span className="text-primary font-medium group-hover:text-primary-light">
                    {resource.name}
                  </span>
                  {resource.description && (
                    <p className="text-sm text-slate-400 mt-0.5">
                      {resource.description}
                    </p>
                  )}
                </div>
                {/* Updated: external link hover to primary */}
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors ml-2" />
              </a>
            </li>
          ))}
        </ul>
      )
    }
  ], [details, seasonalData, peakDiff, offPeakDiff]);

  return (
    <div>
      <div className="relative pb-4 mb-6 border-b border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{region}</h2>
            <p className="text-sm text-slate-400 mt-1">Regional Insights & Analytics</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-white">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 1
              }).format(currentRevenue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{marketShare}% market share</p>
          </div>
        </div>
        {currentSeason !== "All" && (
          <div className={`absolute top-0 right-0 px-2 py-1 text-xs rounded ${
            currentSeason === "Peak" ? "bg-green-500/20 text-green-400" :
            currentSeason === "Off-Peak" ? "bg-orange-500/20 text-orange-400" :
            currentSeason === "Shoulder" ? "bg-yellow-500/20 text-yellow-400" :
            ""
          }`}>
            {currentSeason} Season
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {sections.map(({ id, title, icon: Icon, content }) => (
          <div key={id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
            <button
              onClick={() => toggleSection(id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              aria-expanded={openSections.has(id)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  {/* Updated: section icons to primary */}
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-slate-200">{title}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                openSections.has(id) ? 'rotate-180' : ''
              }`} />
            </button>
            
            {openSections.has(id) && (
              <div className="p-4 bg-slate-900/30 border-t border-slate-800">
                {typeof content === 'string' ? (
                  <p className="text-slate-300 leading-relaxed">{content}</p>
                ) : (
                  content
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <p className="text-xs text-slate-500">Revenue Rank</p>
            <p className="text-lg font-semibold text-white">
              #{[...seasonalRegionData].sort((a, b) => b.baseRevenue - a.baseRevenue)
                .findIndex(r => r.region === region) + 1}
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <p className="text-xs text-slate-500">Resources</p>
            <p className="text-lg font-semibold text-white">{details.resources.length}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Best time to visit: {details.bestTimeToVisit}
        </p>
      </div>
    </div>
  );
}