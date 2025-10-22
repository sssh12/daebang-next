"use client";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ initialUserName, initialSchoolName }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(initialUserName || "");
  const [schoolName, setSchoolName] = useState(initialSchoolName || "");
  const supabase = createClient();
  const router = useRouter();
  const pathName = usePathname();

  const fetchAndSetUserData = useCallback(
    async (userId) => {
      if (!userId) {
        setUserName("");
        setSchoolName("");
        return;
      }

      try {
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("name, school_id")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        let finalUserName = userData?.name || "";
        let finalSchoolName = "";

        setUserName(userData?.name || "");
        if (userData?.school_id) {
          const { data: schoolData, error: schoolError } = await supabase
            .from("school")
            .select("name")
            .eq("id", userData.school_id)
            .single();

          if (schoolError) throw schoolError;
          finalSchoolName = schoolData?.name || "";
        }

        setUserName(finalUserName);
        setSchoolName(finalSchoolName);
      } catch (error) {
        console.error("Error fetching user data:", error);

        setUserName("");
        setSchoolName("");
      }
    },
    [supabase]
  );

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const loggedIn = !!session;
        setIsLoggedIn(loggedIn);

        if (loggedIn && session.user) {
          fetchAndSetUserData(session.user.id);
        } else {
          setUserName("");
          setSchoolName("");
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase, fetchAndSetUserData]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error refreshing session:", error);
          setIsLoggedIn(false);
          setUserName("");
          setSchoolName("");
          return;
        }
        const loggedIn = !!session;
        setIsLoggedIn(loggedIn);
        if (loggedIn && session.user) {
          fetchAndSetUserData(session.user.id);
        } else if (!loggedIn) {
          setUserName("");
          setSchoolName("");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [supabase, fetchAndSetUserData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName("");
    setSchoolName("");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 bg-white drop-shadow-sm z-10 border-b border-gray-300">
      <Link href="/agent" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={53}
          height={48}
          className="object-contain h-12 w-auto"
          priority
        />
        <span className="text-main text-xl font-extrabold">Agent</span>
      </Link>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="cursor-pointer hidden md:block border border-accent text-black px-5 py-1.5 hover:bg-gray-100 active:scale-98 transition "
        >
          로그아웃
        </button>
      ) : (
        <div className="flex justify-between items-center">
          <Link href="/agent/login">
            <button className="cursor-pointer hidden md:block border border-accent text-black px-5 py-1.5 hover:bg-gray-100 active:scale-98 transition ">
              로그인
              <span className="text-md text-gray-300 mx-2">|</span>
              회원가입
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
