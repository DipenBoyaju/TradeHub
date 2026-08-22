"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AlertCircle } from "lucide-react";
import { type LoginInput } from "@/lib/validations/auth";
import { loginUser, resendVerificationLink } from "@/app/features/auth/actions/auth";
import VerificationModal from "@/app/features/auth/components/VerificationModal";
import LoginForm from "@/app/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [showUnverifiedModal, setShowUnverifiedModal] = React.useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string>("");
  const [isResending, setIsResending] = React.useState(false);
  const [resendStatus, setResendStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);


  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setResendStatus(null);

    try {
      const response = await loginUser(data);

      if (!response.success) {
        if (response.isUnverified && response.email) {
          setUnverifiedEmail(response.email);
          setShowUnverifiedModal(true);
        } else {
          setServerError(response.error || "Invalid email or password.");
        }
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch {
      setServerError("A network error occurred. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;

    setIsResending(true);
    setResendStatus(null);

    const res = await resendVerificationLink(unverifiedEmail);

    if (res.success) {
      setResendStatus({
        type: "success",
        message: "A fresh verification link has been sent to your inbox!",
      });
    } else {
      setResendStatus({
        type: "error",
        message: res.error || "Failed to resend verification email.",
      });
    }

    setIsResending(false);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-2xl border border-zinc-200">
        <h1 className="lg:text-4xl md:text-2xl text-4xl font-bold text-center py-5 text-shadow-2xs text-shadow-zinc-600">Nepa<span className="text-emerald-600">Hub</span></h1>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1 text-center">Welcome back</h1>
        <p className="text-sm text-zinc-500 mb-6 text-center">Sign in to access your account</p>

        {serverError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        <LoginForm onSubmit={onSubmit} />

        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-600">
            New to Trade Hub?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {showUnverifiedModal && (
        <VerificationModal
          unverifiedEmail={unverifiedEmail}
          isResending={isResending}
          resendStatus={resendStatus}
          setShowUnverifiedModal={setShowUnverifiedModal}
          handleResend={handleResend}
        />
      )}
    </div>
  );
}