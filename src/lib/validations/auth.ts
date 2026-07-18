import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email address format." });

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." });

export const step1Schema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const step2Schema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  dob: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  gender: z.enum(["male", "female", "other"], {
    error: "Please select a valid gender option.",
  }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long." }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: step2Schema.shape.firstName,
  lastName: step2Schema.shape.lastName,
  dob: step2Schema.shape.dob,
  gender: step2Schema.shape.gender,
  phoneNumber: step2Schema.shape.phoneNumber,
  address: step2Schema.shape.address,
  agreedToTerms: step2Schema.shape.agreedToTerms,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required." }),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
