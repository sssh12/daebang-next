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
      <Link href={isLoggedIn ? "/map" : "/"}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={53}
          height={48}
          className="object-contain h-12 w-auto"
          priority
        />
      </Link>
      <div className="flex justify-between">
        <nav className="flex justify-center items-center mr-16">
          <ul className="hidden md:flex items-center space-x-5">
            {NAV_LINKS.map((link) => {
              const isAgentLink = link.key === "agent";
              return (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className={`p-3 cursor-pointer rounded hover:bg-gray-100 transition ${
                      pathName === link.href ? "text-accent font-semibold" : ""
                    }`}
                    target={isAgentLink ? "_blank" : undefined}
                    rel={isAgentLink ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2 hover:bg-gray-100 p-2 rounded transition cursor-pointer">
              <span className="font-semibold">{userName || ""}님</span>{" "}
              {schoolName && (
                <span className="text-main text-sm">{schoolName}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer hidden font-semibold md:block bg-accent text-white px-5 py-2 rounded hover:bg-main active:scale-98 transition "
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="cursor-pointer hidden font-semibold md:block bg-accent text-white px-5 py-2 rounded hover:bg-main active:scale-98 transition ">
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
