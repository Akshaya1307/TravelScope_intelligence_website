import { NextResponse } from "next/server";

const TENANT_ID = process.env.AZURE_TENANT_ID!;
const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;

const WORKSPACE_ID = "88435b00-a3ee-4a24-8fd6-f2658f31e236";
const DATASET_ID = "30e97004-484a-4cd3-8204-917ee9288a7f";

export async function GET() {
  try {
    const token = await getAccessToken();
    const data: any = await executeQuery(token);   // ✅ FIX 1 (TypeScript)

    const rows = data?.results?.[0]?.tables?.[0]?.rows || [];  // ✅ FIX 2

    return NextResponse.json(rows);

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://analysis.windows.net/powerbi/api/.default"
      })
    }
  );

  const data = await response.json();
  return data.access_token;
}

async function executeQuery(token: string): Promise<any> {   // ✅ FIX 3
  const daxQuery = `
  EVALUATE
  SUMMARIZECOLUMNS(
      'regenerated_large_travel_dataset'[destination_region],

      "TotalRevenue",
        SUM('regenerated_large_travel_dataset'[tourism_revenue_usd]),

      "AvgStay",
        AVERAGE('regenerated_large_travel_dataset'[average_stay_days])
  )
  `;

  const response = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/datasets/${DATASET_ID}/executeQueries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        queries: [{ query: daxQuery }]
      })
    }
  );

  return response.json();
}