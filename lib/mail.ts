import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "🔒 Confirm Your Email - Welcome Aboard!",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to CrackHub! 🎉</h2>
        <p style="color: #555;">You're just one step away from unlocking all the great features we offer.</p>
        <p style="color: #555;">Please confirm your email to get started.</p>
        <a href="${confirmationLink}" 
          style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          ✅ Verify My Email
        </a>
        <p style="color: #888; font-size: 12px;">If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
