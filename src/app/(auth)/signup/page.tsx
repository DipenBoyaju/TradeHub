"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1Schema,
  step2Schema,
  type Step1Input,
  type Step2Input,
} from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";

export default function SignupForm() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Collect and hold data between form visual transformations statefully
  const [collectedData, setCollectedData] = React.useState<
    Partial<Step1Input & Step2Input>
  >({});

  // Dynamic conditional dynamic instancing configuration hooked to validation strategies per step transitions
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
    } catch (err) {
      setServerError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-600">
          Your account has been created.{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </a>{" "}
          to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-135 bg-white border border-neutral-200 rounded-xl p-10">
        <div className="mb-8 border-b border-neutral-100 pb-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-neutral-900">
              Create Account
            </h1>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded">
              Step {step} of 2
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            {step === 1
              ? "Enter your email and choose a secure password."
              : "Tell us a bit more about yourself."}
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(step === 1 ? handleNext : onFinalSubmit)}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full h-11 px-4 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {errors.email?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full h-11 px-4 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.confirmPassword.message)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
              >
                Next Step
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.firstName?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors.firstName.message)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.lastName?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {String(errors.lastName.message)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dob")}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dob?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.dob.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.gender.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phoneNumber?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.phoneNumber.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.address?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {String(errors.address.message)}
                  </p>
                )}
              </div>

              <div className="flex items-start items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  {...register("agreedToTerms")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="agreedToTerms"
                  className="text-sm text-gray-600"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.agreedToTerms?.message && (
                <p className="text-xs text-red-500">
                  {String(errors.agreedToTerms.message)}
                </p>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-1/3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition text-center disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Account..." : "Submit Registration"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
