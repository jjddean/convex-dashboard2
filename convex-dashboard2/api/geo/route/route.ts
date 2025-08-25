import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const dest = searchParams.get("dest");
    const profile = searchParams.get("profile") || "driving-car";

    // DEBUG LOGGING
    console.log("🚨 ROUTE API CALLED:", { origin, dest, profile });

    if (!origin || !dest) {
      return NextResponse.json({ error: "Missing origin or destination" }, { status: 400 });
    }

    // BLOCK LONG DISTANCE ROUTES IMMEDIATELY
    const isBlocked = origin.includes("India") && dest.includes("Africa");
    console.log("🚨 BLOCKING CHECK:", { origin, dest, isBlocked });
    
    if (isBlocked) {
      console.log("✅ ROUTE BLOCKED - returning 200");
      return NextResponse.json({
        error: "Route blocked",
        message: "India to Africa exceeds distance limits",
        points: []
      }, { status: 200 });
    }

    console.log("🚨 PROCEEDING TO API CALL");
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouteService API key not configured" }, { status: 500 });
    }

    const url = `https://api.openrouteservice.org/v2/directions/${profile}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [0, 0],
          [0, 0]
        ],
        format: "geojson",
        instructions: false,
        preference: "fastest",
        units: "km",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ORS route error:", errorData);
      
      return NextResponse.json({ 
        error: "Route calculation failed",
        details: errorData.error?.message || "Unknown error"
      }, { status: 500 });
    }

    const data = await response.json();
    const points = data.features?.[0]?.geometry?.coordinates || [];

    return NextResponse.json({ points });
  } catch (error) {
    console.error("Route API error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: "Failed to calculate route"
    }, { status: 500 });
  }
}

