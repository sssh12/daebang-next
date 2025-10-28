import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sw_lat = searchParams.get("sw_lat");
  const sw_lng = searchParams.get("sw_lng");
  const ne_lat = searchParams.get("ne_lat");
  const ne_lng = searchParams.get("ne_lng");

  if (!sw_lat || !sw_lng || !ne_lat || !ne_lng) {
    return NextResponse.json(
      { error: "Missing boundary parameters" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      `id, title, price_type, price, deposit, room_type, lat, lng, images, room_size, floor,
       maintenance_fee, "distanceMinutes", "securityOptions", living_options, "petAllowed",
       year_built, "nearbyFacilities", "roomOptions", "hasParking", "hasElevator", direction, "shortTermLease", "moveInDate"`
    )
    .gte("lat", sw_lat)
    .lte("lat", ne_lat)
    .gte("lng", sw_lng)
    .lte("lng", ne_lng);

  if (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
