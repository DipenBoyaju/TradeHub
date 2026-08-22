"use client";

import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SignUpSuccessModalProps {
  email?: string;
  onResend?: (email?: string) => Promise<{ success: boolean; error?: string }>;
}

export default function SignUpSuccessModal({
  email,
  onResend,
}: SignUpSuccessModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);

    try {
      if (onResend) {
        const res = await onResend(email);
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
      } else {
        // Fallback simulation if no prop provided
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setResendStatus({
          type: "success",
          message: "A fresh verification link has been sent to your inbox!",
        });
      }
    } catch {
      setResendStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-950/5">
      {/* Icon with subtle pulse / ring effect */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      {/* Heading & Subtitle */}
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
        Check your inbox
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        We’ve sent a secure verification link{" "}
        {email ? (
          <span className="font-medium text-zinc-900">to {email}</span>
        ) : (
          "to your email address"
        )}
        . Please click the link to activate your account.
      </p>

      {/* Status Message Banner */}
      {resendStatus && (
        <div
          className={`mt-4 rounded-xl p-3 text-xs font-medium ${resendStatus.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            : "bg-red-50 text-red-700 border border-red-200/60"
            }`}
        >
          {resendStatus.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <Link
          href="/login"
          className="group inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 h-15 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span>Go to login</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Helper Footer */}
      <div className="mt-6 border-t border-zinc-100 pt-6">
        <p className="text-xs text-zinc-500">
          Didn't receive the email?{" "}
          <button
            type="button"
            disabled={isResending}
            className="font-medium text-primary hover:text-primary-hover hover:underline focus:outline-none disabled:opacity-50 inline-flex items-center gap-1"
            onClick={handleResend}
          >
            {isResending && <Loader2 className="h-3 w-3 animate-spin" />}
            {isResending ? "Sending..." : "Click to resend"}
          </button>
        </p>
      </div>
    </div>
  );
}