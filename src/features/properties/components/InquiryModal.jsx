"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { X, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function InquiryModal({ property, onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realtorInfo, setRealtorInfo] = useState({
    name: "미등록",
    phone: "미등록",
  });
  const supabase = createClient();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, [supabase, property]);

  const handleTextInquiry = () => {
    alert(
      `[구현 예정] ${realtorInfo.name}(${realtorInfo.phone}) 중개사에게 문자 문의 요청이 전송되었습니다.`
    );
    onClose();
  };

  if (isLoading) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
          <p>로딩 중...</p>
        </div>
      </div>,
      document.body
    );
  }

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-gray-800/10 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition cursor-pointer"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center text-main">
          문의하기
        </h2>

        {isLoggedIn ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-6">
              궁금한 점을 중개사에게 직접 문의해보세요.
            </p>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-accent flex items-center">
                <Phone size={20} className="mr-2" /> 전화 문의
              </h3>
              <div className="text-sm space-y-1 mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  중개사무소에 연락하여 방문일을 예약하세요.
                </p>
                <p>
                  <span className="font-semibold text-gray-700">중개사:</span>{" "}
                  {realtorInfo.name}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">연락처:</span>{" "}
                  <span className="text-blue-700">{realtorInfo.phone}</span>
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-accent flex items-center">
                <MessageSquare size={20} className="mr-2" /> 문자 문의
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                문의 요청 시 회원님의 연락처가 중개사에게 전달됩니다.
              </p>
              <button
                onClick={handleTextInquiry}
                disabled={realtorInfo.phone === "미등록"}
                className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
                  realtorInfo.phone === "미등록"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-98"
                }`}
              >
                문자로 문의하기
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              문의하시려면 회원가입 혹은 로그인이 필요합니다.
            </p>
            <Link href="/login">
              <button className="w-full bg-main text-white py-2 px-4 rounded font-semibold hover:bg-accent transition active:scale-98 cursor-pointer">
                로그인
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
