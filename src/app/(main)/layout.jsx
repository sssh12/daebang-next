import Header from "@/components/layout/main/Header";
import Footer from "@/components/layout/main/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: {
    default: "대방 - 대학생을 위한 똑똑한 방 구하기",
  },
  description:
    "대학생을 위한 최적의 방 찾기 솔루션. 원하는 방을 쉽게 찾아보세요.",
};

export default async function MainLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = null;
  let schoolName = null;

  if (user) {
    const { data: userData } = await supabase
      .from("user")
      .select("name, school_id")
      .eq("id", user.id)
      .single();

    if (userData) {
      userName = userData.name;
      if (userData.school_id) {
        const { data: schoolData } = await supabase
          .from("school")
          .select("name")
          .eq("id", userData.school_id)
          .single();
        schoolName = schoolData?.name || null;
      }
    }
  }

  return (
    <>
      <Header initialUserName={userName} initialSchoolName={schoolName} />
      <main className="mt-20">{children}</main>
      <Footer />
    </>
  );
}
