import { NextResponse } from "next/server";

const TENANT_ID = process.env.AZURE_TENANT_ID!;
const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;

const WORKSPACE_ID = "88435b00-a3ee-4a24-8fd6-f2658f31e236";
const DATASET_ID = "30e97004-484a-4cd3-8204-917ee9288a7f";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");

    if (!yearParam) {
      return NextResponse.json(
        { error: "Year parameter is required" },
        { status: 400 }
      );
    }

    const year = Number(yearParam);

    if (isNaN(year)) {
      return NextResponse.json(
        { error: "Invalid year value" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json(
        { error: "Access token failed" },
        { status: 500 }
      );
    }

    const result = await executeQuery(token, year);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Log the response structure for debugging
    console.log("API Response Structure:", JSON.stringify(result.data, null, 2));

    // Safely access the data with proper path checking
    const rows = result.data?.results?.[0]?.tables?.[0]?.rows || [];

    if (rows.length === 0) {
      console.log("No rows returned for year:", year);
      return NextResponse.json({
        year,
        months: [],
        values: [],
        message: "No data found for this year"
      });
    }

    // Log first row to see column names
    console.log("First row columns:", Object.keys(rows[0]));

    const monthOrder = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthMap: Record<string, number> = {};

    rows.forEach((row: any, index: number) => {
      // Try different possible column name patterns
      const possibleMonthKeys = [
        "regenerated_large_travel_dataset[month]",
        "[month]",
        "month",
        "Month",
        "regenerated_large_travel_dataset_month",
        "month_name"
      ];

      const possibleRevenueKeys = [
        "MonthlyRevenue",
        "[MonthlyRevenue]",
        "revenue",
        "Revenue",
        "tourism_revenue_usd",
        "regenerated_large_travel_dataset[tourism_revenue_usd]"
      ];

      // Find the actual month column
      let monthName = null;
      for (const key of possibleMonthKeys) {
        if (row[key] !== undefined) {
          monthName = row[key];
          console.log(`Found month using key: ${key} = ${monthName}`);
          break;
        }
      }

      // Find the actual revenue column
      let revenue = 0;
      for (const key of possibleRevenueKeys) {
        if (row[key] !== undefined) {
          revenue = Number(row[key]) || 0;
          console.log(`Found revenue using key: ${key} = ${revenue}`);
          break;
        }
      }

      if (monthName) {
        monthMap[monthName] = revenue;
      } else {
        console.log(`Row ${index}: No month column found`, row);
      }
    });

    const values = monthOrder.map((m) => monthMap[m] ?? 0);

    // Log the final mapping
    console.log("Month Map:", monthMap);
    console.log("Final Values:", values);

    return NextResponse.json({
      year,
      months: monthOrder,
      values,
      debug: {
        rowCount: rows.length,
        sampleRow: rows[0] || null
      }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

async function getAccessToken() {
  const tokenUrl =
    "https://login.microsoftonline.com/" +
    TENANT_ID +
    "/oauth2/v2.0/token";

  try {
    const response = await fetch(tokenUrl, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token Error:", errorText);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Token Fetch Error:", error);
    return null;
  }
}

async function executeQuery(
  accessToken: string,
  year: number
) {
  // Alternative DAX queries to try
  const daxQueries = [
    // Query 1: Using SUMMARIZE with explicit column names
    `
EVALUATE
SUMMARIZE(
    FILTER(
        'regenerated_large_travel_dataset',
        'regenerated_large_travel_dataset'[year] = ${year}
    ),
    'regenerated_large_travel_dataset'[month],
    "MonthlyRevenue", SUM('regenerated_large_travel_dataset'[tourism_revenue_usd])
)
`,
    // Query 2: Using GROUPBY
    `
EVALUATE
GROUPBY(
    FILTER(
        'regenerated_large_travel_dataset',
        'regenerated_large_travel_dataset'[year] = ${year}
    ),
    'regenerated_large_travel_dataset'[month],
    "MonthlyRevenue", SUMX(CURRENTGROUP(), 'regenerated_large_travel_dataset'[tourism_revenue_usd])
)
`,
    // Query 3: Simpler query to test data access
    `
EVALUATE
TOPN(
    10,
    'regenerated_large_travel_dataset',
    'regenerated_large_travel_dataset'[year]
)
`
  ];

  // Try each query until one works
  for (let i = 0; i < daxQueries.length; i++) {
    const daxQuery = daxQueries[i];
    console.log(`Trying Query ${i + 1}:`, daxQuery);

    const response = await fetch(
      "https://api.powerbi.com/v1.0/myorg/groups/" +
        WORKSPACE_ID +
        "/datasets/" +
        DATASET_ID +
        "/executeQueries",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: [{ query: daxQuery }],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Check if we got data back
      if (data?.results?.[0]?.tables?.[0]?.rows?.length > 0) {
        console.log(`Query ${i + 1} succeeded with data`);
        return { success: true, data };
      } else {
        console.log(`Query ${i + 1} returned empty data`);
      }
    } else {
      const errorText = await response.text();
      console.log(`Query ${i + 1} failed:`, errorText);
    }
  }

  // If all queries fail, return error
  return { 
    success: false, 
    error: "All DAX queries failed or returned no data" 
  };
}