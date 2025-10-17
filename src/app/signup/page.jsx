"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";

const schema = z
  .object({
    email: z.string().email("유효한 이메일을 입력하세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    passwordConfirm: z.string().min(6, "비밀번호 확인을 입력하세요."),
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    school_id: z.string().min(1, "학교를 선택하세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export default function SignupPage() {
  const [schools, setSchools] = useState([]);
  const [serverErrors, setServerErrors] = useState({});
  const supabase = createClient();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase.from("school").select("*");
      if (!error) setSchools(data);
    };
    fetchSchools();
  }, []);

  const onSubmit = async (values) => {
    setServerErrors({});
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError("email", { type: "server", message: error.message });
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: userError } = await supabase.from("user").insert([
        {
          id: userId,
          name: values.name,
          school_id: Number(values.school_id),
        },
      ]);

      if (userError) {
        setError("school_id", {
          type: "server",
          message: "추가 정보 저장에 실패했습니다.",
        });
        return;
      }
    }

    router.push("/map");
    router.refresh();
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded shadow ">
        <h1 className="text-2xl font-bold mb-6 space-y-4">회원가입</h1>
        <p className="text-gray-600 mb-10  border-b border-accent pb-4 text-sm">
          서비스 이용을 위해 아래 정보를 입력해주세요.
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
            <label className="block mb-3 font-medium">이름</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-gray-300 border- px-3 py-2 rounded"
              placeholder="이름 입력"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-3 font-medium">학교</label>
            <div className="relative">
              <select
                {...register("school_id")}
                className="w-full border border-gray-300 px-3 py-2 rounded appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  학교를 선택하세요
                </option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <ChevronDown className="w-6 h-6 text-gray-500" />
              </span>
            </div>
            {errors.school_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.school_id.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-3 font-medium">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full border border-gray-300 px-3 py-2 rounded pr-10"
                autoComplete="new-password"
                placeholder="비밀번호 6자리 이상 입력"
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
          <div>
            <label className="block mb-3 font-medium">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                {...register("passwordConfirm")}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                autoComplete="new-password"
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showPasswordConfirm ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-main text-white py-2 rounded font-semibold hover:bg-accent transition active:scale-98 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-blue-700 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
