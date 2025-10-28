"use client";

import { FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/map") return null;

  return (
    <footer className="bg-gray-800 text-white py-8 shadow-top">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <p>&copy; {new Date().getFullYear()} 대방</p>
        <p className="mt-2 text-sm text-gray-400">
          대학생을 위한 똑똑한 방 구하기 서비스
        </p>
        <ul className="mt-4 flex justify-center space-x-12">
          {FOOTER_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="text-white hover:text-green-600 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
