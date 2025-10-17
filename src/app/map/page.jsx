import { createClient } from "@/lib/supabase/server";
import MapClientPage from "@/features/map/components/MapClientPage";

const DEFAULT_CENTER = { lat: 36.337093681740996, lng: 127.4450861750031 };

export default async function MapPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let center = DEFAULT_CENTER;

  if (user) {
    const { data: userData } = await supabase
      .from("user")
      .select("school_id")
      .eq("id", user.id)
      .single();

    if (userData?.school_id) {
      const { data: schoolData } = await supabase
        .from("school")
        .select("lat, lng")
        .eq("id", userData.school_id)
        .single();

      if (schoolData?.lat && schoolData?.lng) {
        center = { lat: schoolData.lat, lng: schoolData.lng };
      }
    }
  }

  return <MapClientPage center={center} />;
}
