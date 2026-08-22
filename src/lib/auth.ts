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
        const fromAddress =
          process.env.EMAIL_FROM || "NepaHub <noreply@dipenboyaju.com.np>";

        await resend.emails.send({
          from: fromAddress,
          to: user.email,
          subject: "Verify your email address - NepaHub",
          html: `
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          <tr>
            <td style="padding: 40px 32px;">

              <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; text-align: center; margin: 0 0 16px 0;">
                Welcome to Nepa<span style="color: #059669;">Hub</span>
              </h2>
              
              <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                Thanks for signing up! Please verify your email address to unlock your account and start trading.
              </p>

              <div style="text-align: center; margin: 0 0 32px 0;">
                <a href="${url}" target="_blank" style="background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2);">
                  Verify Email Address
                </a>
              </div>

              <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0; word-break: break-all;">
                If the button above doesn't work, copy and paste this link into your browser:
                <br>
                <a href="${url}" style="color: #059669; text-decoration: underline;">${url}</a>
              </p>

              <!-- Security Notice -->
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                This link will expire in 24 hours. If you didn't create an account with NepaHub, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} NepaHub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
        `,
        });
      } catch (error) {
        console.error("Failed to send verification email via Resend:", error);
      }
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL!, process.env.NEXT_PUBLIC_APP_URL!].filter(
    Boolean,
  ),
  plugins: [nextCookies()],
});
