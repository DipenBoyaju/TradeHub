"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { loginSchema, registrationSchema } from "@/lib/validations/auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginUser(formData: unknown) {
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed.",
      details: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof APIError) {
      if (error.message?.toLowerCase().includes("email not verified")) {
        return {
          success: false,
          error: "Your email is not verified yet. Please check your inbox for the verification link.",
          isUnverified: true,
          email,
        };
      }
      return {
        success: false,
        error: error.message || "Invalid email or password.",
      };
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function registerUser(formData: unknown) {
  const result = registrationSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed.",
      details: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, dob, gender, phoneNumber, address, agreedToTerms } =
    result.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        success: false,
        error: "An account with this email address already exists.",
      };
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
      },
    });

    if (!signUpResult?.user?.id) {
      return {
        success: false,
        error: "Failed to register authentication credentials.",
      };
    }

    await prisma.userProfile.create({
      data: {
        userId: signUpResult.user.id,
        firstName,
        lastName,
        dob,
        gender,
        phoneNumber,
        address,
        agreedToTerms,
      },
    });

    return { success: true, message: "User registered successfully." };
  } catch (error: unknown) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message || "Registration failed.",
      };
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    await auth.api.sendVerificationEmail({
      body: { email }
    });
    return {
      success: true,
      message: "Verification email sent!"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resend verification email."
    }
  }
}
