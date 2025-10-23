import Link from "next/link";
import Image from "next/image";

export default function Header() {
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
        <span className="text-main text-xl font-mono font-extrabold border-b-2 border-main pb-1">
          Agent
        </span>
      </Link>
      <div className="flex justify-between items-center">
        <Link href="/agent/login">
          <button
            className="cursor-pointer hidden md:block border bg-white border-accent text-black px-5 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={true}
          >
            공인 중개사 로그인
            <span className="text-md text-gray-300 mx-2">|</span>
            회원가입
          </button>
        </Link>
      </div>
    </header>
  );
}
