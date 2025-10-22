import Header from "@/components/layout/agent/Header";

export const metadata = {
  title: {
    default: "대방 공인 중개사",
  },
  description: "대방 공인 중개사 사이트입니다.",
};

export default function AgentLayout({ children }) {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
    </>
  );
}
