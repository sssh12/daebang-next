import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gray-100 drop-shadow-xl">
      <div className="max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text tracking-tight">
          대학생을 위한 똑똑한 방 구하기
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 sm:text-lg">
          대학생을 위한 최적의 방 찾기 솔루션. 번거로운 절차는 없애고, 원하는
          방을 쉽게 찾아보세요.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <button className="cursor-pointer bg-main text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full  sm:text-lg font-semibold hover:bg-accent transition hover:scale-120 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95">
              회원가입하고 시작하기
            </button>
          </Link>
        </div>
        <p className="mt-4 text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-700 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}
