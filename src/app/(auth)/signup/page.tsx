"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { registerUser } from "@/app/features/auth/actions/auth";
import SignUpForm from "@/app/features/auth/components/SignUpForm";
import SignUpSuccessModal from "@/app/features/auth/components/SignUpSuccessModel";

export default function SignupPage() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const onFinalSubmit = async (data: any) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await registerUser(data);
      if (!response.success) {
        setServerError(response.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setServerError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return <SignUpSuccessModal />
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 bg-white border border-zinc-200 rounded-xl">
        <h1 className="lg:text-4xl md:text-2xl text-4xl font-bold text-center py-5 text-shadow-2xs text-shadow-emerald-600">Nepa<span className="text-emerald-600">Hub</span></h1>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              Create an account
            </h2>
            <span className="text-xs font-semibold text-primary bg-indigo-50 px-2.5 py-1 rounded-md">
              Step {step} of 2
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            {step === 1
              ? "Enter your email and choose a secure password."
              : "Tell us a bit more about yourself."}
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <SignUpForm step={step} setStep={setStep} isSubmitting={isSubmitting} onFinalSubmit={onFinalSubmit} />

        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-hover hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}