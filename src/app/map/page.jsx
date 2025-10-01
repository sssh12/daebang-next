import { createClient } from "@/utils/supabase/server";
import MapClientPage from "./MapClientPage";

// 디폴트 좌표(비로그인 시 서울대)
const DEFAULT_CENTER = { lat: 37.4602, lng: 126.9527 };

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

  const { data: properties } = await supabase.from("properties").select("*");

  return <MapClientPage center={center} properties={properties || []} />;
}
