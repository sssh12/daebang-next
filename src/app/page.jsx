import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/map");
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
