import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

export const metadata = {
  title: {
    default: "대방 공인 중개사",
  },
  description: "대방 공인 중개사 사이트입니다.",
};

export default async function AgentLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="mt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
