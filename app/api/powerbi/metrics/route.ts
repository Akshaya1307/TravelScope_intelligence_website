import { NextResponse } from "next/server";

const TENANT_ID = process.env.AZURE_TENANT_ID!;
const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;

const WORKSPACE_ID = "88435b00-a3ee-4a24-8fd6-f2658f31e236";
const DATASET_ID = "30e97004-484a-4cd3-8204-917ee9288a7f";

export async function GET() {
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to acquire access token" },
        { status: 500 }
      );
    }

    const powerBIData = await executeQuery(token);

    const row =
      powerBIData?.results?.[0]?.tables?.[0]?.rows?.[0];

    if (!row) {
      return NextResponse.json({
        totalRevenue: 0,
        activeRegions: 0,
        avgStay: 0,
        peakSeasonRevenue: 0
      });
    }

    // 🔥 CLEAN RESPONSE FORMAT
    return NextResponse.json({
      totalRevenue: row["[TotalRevenue]"] ?? 0,
      activeRegions: row["[ActiveRegions]"] ?? 0,
      avgStay: row["[AvgStay]"] ?? 0,
      peakSeasonRevenue: row["[PeakSeasonRevenue]"] ?? 0
    });

  } catch (error: any) {
    console.error("Power BI API Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function getAccessToken(): Promise<string | null> {
  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "https://analysis.windows.net/powerbi/api/.default"
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Token Error:", data);
    return null;
  }

  return data.access_token;
}

async function executeQuery(accessToken: string) {
  const daxQuery = `
    EVALUATE
    SUMMARIZECOLUMNS(
      "TotalRevenue",
        SUM('regenerated_large_travel_dataset'[tourism_revenue_usd]),
      "ActiveRegions",
        DISTINCTCOUNT('regenerated_large_travel_dataset'[destination_region]),
      "AvgStay",
        AVERAGE('regenerated_large_travel_dataset'[average_stay_days]),
      "PeakSeasonRevenue",
        CALCULATE(
          SUM('regenerated_large_travel_dataset'[tourism_revenue_usd]),
          'regenerated_large_travel_dataset'[peak_travel_flag] = TRUE()
        )
    )
  `;

  const response = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/datasets/${DATASET_ID}/executeQueries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        queries: [{ query: daxQuery }]
      })
    }
  );

  const raw = await response.json();

  if (!response.ok) {
    console.error("Power BI Query Error:", raw);
    throw new Error("Power BI query failed");
  }

  return raw;
}