"use server";

import { Resend } from "resend";

// ▼ CONTACT — paste the destination email address here
const CONTACT_EMAIL = "admin@sprtd.co";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await getResend().emails.send({
      from: "MCWS Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; color: #111;">
          <h2 style="font-size: 20px; margin-bottom: 4px;">New Contact Message</h2>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #333;">${message}</p>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">Sent from the MCWS contact form at mcws.org</p>
        </div>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
