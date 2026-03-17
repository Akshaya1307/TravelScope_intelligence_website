import { NextResponse } from "next/server";

// Environment variables with validation
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

const WORKSPACE_ID = "88435b00-a3ee-4a24-8fd6-f2658f31e236";
const DATASET_ID = "30e97004-484a-4cd3-8204-917ee9288a7f";

// Validate environment variables at startup
if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Missing Azure AD credentials in environment variables");
}

export async function GET() {
  try {
    // Step 1: Get access token
    const token = await getAccessToken();
    if (!token) {
      console.error("❌ Failed to acquire access token from Azure AD");
      return NextResponse.json(
        { 
          error: "Failed to acquire access token",
          details: "Authentication service unavailable"
        },
        { status: 500 }
      );
    }

    // Step 2: Execute Power BI query
    const powerBIData = await executeQuery(token);
    
    // Step 3: Extract and validate metrics
    const metrics = extractMetrics(powerBIData);

    // Step 4: Return formatted response with caching headers
    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error("❌ Power BI API Error:", {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return appropriate error response
    return NextResponse.json(
      { 
        error: "Failed to fetch Power BI metrics",
        message: process.env.NODE_ENV === 'development' ? error.message : "Internal server error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Get Azure AD access token for Power BI
 */
async function getAccessToken(): Promise<string | null> {
  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    console.error("❌ Missing Azure AD credentials");
    return null;
  }

  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://analysis.windows.net/powerbi/api/.default",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Token Error:", {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        error_description: data.error_description,
      });
      return null;
    }

    console.log("✅ Access token acquired successfully");
    return data.access_token;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("❌ Token request timed out after 10 seconds");
    } else {
      console.error("❌ Token Request Failed:", {
        message: error.message,
        name: error.name,
      });
    }
    return null;
  }
}

/**
 * Execute DAX query against Power BI dataset
 */
async function executeQuery(accessToken: string) {
  // More efficient DAX query using ROW() for single row result
  const daxQuery = `
    EVALUATE
    ROW(
      "TotalRevenue", SUM('regenerated_large_travel_dataset'[tourism_revenue_usd]),
      "ActiveRegions", DISTINCTCOUNT('regenerated_large_travel_dataset'[destination_region]),
      "AvgStay", AVERAGE('regenerated_large_travel_dataset'[average_stay_days]),
      "PeakSeasonRevenue", 
        CALCULATE(
          SUM('regenerated_large_travel_dataset'[tourism_revenue_usd]),
          'regenerated_large_travel_dataset'[peak_travel_flag] = TRUE()
        )
    )
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/datasets/${DATASET_ID}/executeQueries`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [{ query: daxQuery }],
          // Optional: Add serializerSettings for better performance
          serializerSettings: {
            includeNulls: false,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const rawData = await response.json();

    if (!response.ok) {
      console.error("❌ Power BI Query Error:", {
        status: response.status,
        statusText: response.statusText,
        error: rawData.error,
        message: rawData.message,
      });
      throw new Error(`Power BI query failed: ${rawData.error?.message || response.statusText}`);
    }

    console.log("✅ Power BI query executed successfully");
    return rawData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("❌ Power BI query timed out after 15 seconds");
      throw new Error("Query timeout");
    }
    console.error("❌ Power BI Request Failed:", {
      message: error.message,
      name: error.name,
    });
    throw error;
  }
}

/**
 * Extract and validate metrics from Power BI response
 */
function extractMetrics(powerBIData: any) {

  const defaultMetrics = {
    totalRevenue: 0,
    activeRegions: 0,
    avgStay: 0,
    peakSeasonRevenue: 0,
    forecastRevenue: 0,
    forecastGrowthRate: 0,
    estimatedCost: 0,
    estimatedProfit: 0,
    profitMargin: 0,
    aiInsightMessage: "No insights available."
  };

  try {
    const row = powerBIData?.results?.[0]?.tables?.[0]?.rows?.[0];

    if (!row) {
      console.warn("⚠️ No data returned from Power BI query");
      return defaultMetrics;
    }

    const getNumericValue = (value: any): number => {
      if (value === null || value === undefined) return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : Math.max(0, num);
    };

    const totalRevenue = getNumericValue(row["[TotalRevenue]"] ?? row["TotalRevenue"]);
    const activeRegions = getNumericValue(row["[ActiveRegions]"] ?? row["ActiveRegions"]);
    const avgStay = getNumericValue(row["[AvgStay]"] ?? row["AvgStay"]);
    const peakSeasonRevenue = getNumericValue(row["[PeakSeasonRevenue]"] ?? row["PeakSeasonRevenue"]);

    /* ================= 🔮 FORECASTING ================= */

    const forecastGrowthRate = 8 + (avgStay * 0.5);
    const forecastRevenue =
      totalRevenue * (1 + forecastGrowthRate / 100);

    /* ================= 💰 PROFIT SIMULATION ================= */

    const estimatedCost = totalRevenue * 0.65;
    const estimatedProfit = totalRevenue - estimatedCost;

    const profitMargin =
      totalRevenue > 0
        ? (estimatedProfit / totalRevenue) * 100
        : 0;

    /* ================= 🤖 AI INSIGHT GENERATOR ================= */

    let aiInsightMessage = "";

    if (forecastGrowthRate > 10 && avgStay > 4) {
      aiInsightMessage =
        "Strong growth momentum detected. High average stay duration combined with projected revenue increase indicates strong customer retention and premium destination performance.";
    } else if (activeRegions > 20) {
      aiInsightMessage =
        "Wide regional diversification reduces operational risk and supports scalable tourism expansion strategies.";
    } else if (profitMargin > 30) {
      aiInsightMessage =
        "High profitability margin indicates efficient cost management and strong pricing power.";
    } else {
      aiInsightMessage =
        "Tourism performance remains stable with moderate growth potential. Strategic investment in marketing and infrastructure may further enhance revenue scalability.";
    }

    return {
      totalRevenue,
      activeRegions,
      avgStay,
      peakSeasonRevenue,

      forecastRevenue,
      forecastGrowthRate,

      estimatedCost,
      estimatedProfit,
      profitMargin,

      aiInsightMessage
    };

  } catch (error: any) {
    console.error("❌ Error extracting metrics:", error.message);
    return defaultMetrics;
  }
}