"use client";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoggedIn(!!session);

        if (session?.user) {
          const userId = session.user.id;
          const { data: userData } = await supabase
            .from("user")
            .select("name, school_id")
            .eq("id", userId)
            .single();
          setUserName(userData?.name || "");

          if (userData?.school_id) {
            const { data: schoolData } = await supabase
              .from("school")
              .select("name")
              .eq("id", userData.school_id)
              .single();
            setSchoolName(schoolData?.name || "");
          } else {
            setSchoolName("");
          }
        } else {
          setUserName("");
          setSchoolName("");
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 bg-white drop-shadow-sm z-10 border-b border-gray-300">
      <Link href={isLoggedIn ? "/map" : "/"}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          className="object-contain h-12 w-auto"
        />
      </Link>
      <div className="flex justify-between">
        <nav className="flex justify-center items-center mr-16">
          <ul className="hidden md:flex items-center space-x-5">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="p-3 cursor-pointer rounded hover:bg-gray-100 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2 hover:bg-gray-100 p-2 rounded transition cursor-pointer">
              <span className="font-semibold">{userName}님</span>
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
