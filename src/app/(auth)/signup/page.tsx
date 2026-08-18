"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  step1Schema,
  step2Schema,
  type Step1Input,
  type Step2Input,
} from "@/lib/validations/auth";
import { registerUser } from "@/app/features/auth/actions/auth";

export default function SignupForm() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Toggle password visibilities
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [collectedData, setCollectedData] = React.useState<
    Partial<Step1Input & Step2Input>
  >({});

  const currentSchema = step === 1 ? step1Schema : step2Schema;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Partial<Step1Input & Step2Input>>({
    resolver: zodResolver(currentSchema) as Resolver<
      Partial<Step1Input & Step2Input>
    >,
    defaultValues: collectedData,
    mode: "onTouched",
  });

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCollectedData((prev) => ({ ...prev, ...getValues() }));
      setStep(2);
    }
  };

  const handleBack = () => {
    setCollectedData((prev) => ({ ...prev, ...getValues() }));
    setStep(1);
  };

  const onFinalSubmit = async (data: any) => {
    setServerError(null);
    setIsSubmitting(true);

    const consolidatedPayload = { ...collectedData, ...data };

    try {
      const response = await registerUser(consolidatedPayload);
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
    return (
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Check Your Inbox</h2>
        <p className="mt-2 text-sm text-zinc-600">
          We sent a verification link to your email address. Please click the link to verify your account before logging in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white border border-zinc-200 rounded-xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              Create an account
            </h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
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

        {/* Form */}
        <form
          onSubmit={handleSubmit(step === 1 ? handleNext : onFinalSubmit)}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-zinc-300 focus:border-indigo-600"
                    }`}
                />
                {errors.email?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-3.5 pr-10 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-300 focus:border-indigo-600"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full pl-3.5 pr-10 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-300 focus:border-indigo-600"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.confirmPassword.message)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors mt-2"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    {...register("firstName")}
                    className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-300 focus:border-indigo-600"
                      }`}
                  />
                  {errors.firstName?.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {String(errors.firstName.message)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                    className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.lastName
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-300 focus:border-indigo-600"
                      }`}
                  />
                  {errors.lastName?.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {String(errors.lastName.message)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dob")}
                  className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.dob
                    ? "border-red-500 focus:border-red-500"
                    : "border-zinc-300 focus:border-indigo-600"
                    }`}
                />
                {errors.dob?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.dob.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 outline-none transition-colors ${errors.gender
                    ? "border-red-500 focus:border-red-500"
                    : "border-zinc-300 focus:border-indigo-600"
                    }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.gender.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phoneNumber")}
                  className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.phoneNumber
                    ? "border-red-500 focus:border-red-500"
                    : "border-zinc-300 focus:border-indigo-600"
                    }`}
                />
                {errors.phoneNumber?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.phoneNumber.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City, Country"
                  {...register("address")}
                  className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors ${errors.address
                    ? "border-red-500 focus:border-red-500"
                    : "border-zinc-300 focus:border-indigo-600"
                    }`}
                />
                {errors.address?.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {String(errors.address.message)}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    {...register("agreedToTerms")}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-xs text-zinc-600 cursor-pointer"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>
                {errors.agreedToTerms?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {String(errors.agreedToTerms.message)}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-1/3 py-3 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-sm font-medium text-zinc-700 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}