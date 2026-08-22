"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Input, step1Schema, Step2Input, step2Schema } from "@/lib/validations/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FormInput = Partial<Step1Input & Step2Input>;

interface SignUpFormProps {
  step: 1 | 2;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  isSubmitting: boolean;
  onFinalSubmit: (data: FormInput) => Promise<void>
}

export default function SignUpForm({ step, setStep, isSubmitting, onFinalSubmit }: SignUpFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [collectedData, setCollectedData] = React.useState<FormInput>({});

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

  const handleBack = () => {
    setCollectedData((prev) => ({ ...prev, ...getValues() }));
    setStep(1);
  };

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCollectedData((prev) => ({ ...prev, ...getValues() }));
      setStep(2);
    }
  };

  const handleFormSubmit = async (data: FormInput) => {
    if (step === 1) {
      await handleNext();
    } else {
      const mergedPayload = { ...collectedData, ...data };
      await onFinalSubmit(mergedPayload);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 h-14 outline-none transition-colors ${errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-300 focus:border-emerald-700"
                }`}
            />
            {errors.email?.message && (
              <p className="mt-1.5 text-xs text-red-600">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full pl-3.5 pr-10 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none h-14 transition-colors ${errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-emerald-600"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
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
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={`w-full pl-3.5 pr-10 py-3 bg-white border rounded-lg text-sm text-zinc-900 h-14placeholder-zinc-400 outline-none transition-colors ${errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-emerald-700"
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
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors mt-2 h-15"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 outline-none h-14 transition-colors ${errors.firstName
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
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 h-14 placeholder-zinc-400 outline-none transition-colors ${errors.lastName
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
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dob")}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 h-14  outline-none transition-colors ${errors.dob
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
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Gender
            </label>
            <select
              {...register("gender")}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 h-14  outline-none transition-colors ${errors.gender
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
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="+977 (555) 000-0000"
              {...register("phoneNumber", {
                maxLength: {
                  value: 10,
                  message: "Phone number cannot exceed 10 characters",
                }
              })}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 h-14  placeholder-zinc-400 outline-none transition-colors ${errors.phoneNumber
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
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Address
            </label>
            <input
              type="text"
              placeholder="Street, City, Country"
              {...register("address")}
              className={`w-full px-3.5 py-3 bg-white border rounded-lg text-sm text-zinc-900 h-14  placeholder-zinc-400 outline-none transition-colors ${errors.address
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
              className="w-1/3 py-3 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-sm font-medium h-15 text-zinc-700 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors h-15 disabled:opacity-50 flex items-center justify-center gap-2"
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
  )
}