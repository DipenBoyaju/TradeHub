"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    try {
      const response = await loginUser(data);
      if (!response.success) {
        setServerError(response.error || "Something went wrong.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setServerError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white border border-zinc-200 rounded-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Sign in</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your email and password to access your account.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-300 focus:primary"
                }`}
            />
            {errors.email?.message && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:text-primary-hover hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full pl-3.5 pr-10 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-primary"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-600">
            New to Trade Hub?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}