import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: "Trade Hub <noreply@yourdomain.com>",
          to: user.email,
          subject: "Verify your email address - NepaHub",
          html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px;">
              <h2 style="color: #1e293b; text-align: center;">Welcome to Trade Hub!</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Hi ${user.name || "there"},
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Please verify your email address to complete your registration and activate your account.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                If you did not request this email, you can safely ignore it.
              </p>
            </div>
          `,
        })
      } catch (error) {
        console.error("Failed to send verification email via Resend:", error);
      }
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL!, process.env.NEXT_PUBLIC_APP_URL!].filter(
    Boolean,
  ),
  plugins: [nextCookies()],
});
