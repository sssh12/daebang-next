"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">이메일</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border px-3 py-2 rounded"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">이름</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">학교</label>
            <select
              {...register("school_id")}
              className="w-full border px-3 py-2 rounded"
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
            {errors.school_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.school_id.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">비밀번호</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border px-3 py-2 rounded"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">비밀번호 확인</label>
            <input
              type="password"
              {...register("passwordConfirm")}
              className="w-full border px-3 py-2 rounded"
              autoComplete="new-password"
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-main text-white py-2 rounded font-semibold hover:bg-accent transition cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
