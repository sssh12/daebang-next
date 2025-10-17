"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(6, "비밀번호를 입력하세요."),
});

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError("email", {
        type: "server",
        message: "",
      });
      setError("password", {
        type: "server",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
      return;
    }

    router.push("/map");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 space-y-4">로그인</h1>
        <p className="text-gray-600 mb-10 border-b border-accent pb-4 text-sm">
          서비스 이용을 위해 로그인 해주세요.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-3 font-medium">이메일</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-gray-300 border- px-3 py-2 rounded"
              autoComplete="email"
              placeholder="이메일 주소 입력"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-3 font-medium">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                autoComplete="current-password"
                placeholder="비밀번호 입력"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-main text-white py-2 rounded font-semibold hover:bg-accent transition active:scale-98 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">계정이 없으신가요? </span>
          <Link href="/signup" className="text-blue-700 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
