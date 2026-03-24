import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import nodemailer from "npm:nodemailer@6";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const GMAIL_USER = Deno.env.get("GMAIL_USER");
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !NOTIFICATION_EMAIL) {
      return jsonResponse({ error: "Missing GMAIL_USER, GMAIL_APP_PASSWORD, or NOTIFICATION_EMAIL" }, 500);
    }

    const body = await req.json();
    const { type = "donation", name, email, phone, pickup_address, book_quantity, book_condition, message, preferred_pickup } = body;

    // Input validation — common fields
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof pickup_address !== "string" || !pickup_address.trim()
    ) {
      return jsonResponse({ error: "name, email, phone, and pickup_address are required strings" }, 400);
    }

    // Type-specific validation
    if (type === "donation") {
      if (!Number.isInteger(book_quantity) || book_quantity < 1) {
        return jsonResponse({ error: "book_quantity must be a positive integer" }, 400);
      }
      if (!Number.isInteger(book_condition) || book_condition < 1 || book_condition > 5) {
        return jsonResponse({ error: "book_condition must be an integer from 1 to 5" }, 400);
      }
    } else if (type === "pickup") {
      if (typeof preferred_pickup !== "string" || !preferred_pickup.trim()) {
        return jsonResponse({ error: "preferred_pickup is required for pickup requests" }, 400);
      }
    }

    const conditionLabels: Record<number, string> = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Like New",
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeAddress = escapeHtml(pickup_address);
    const safeMessage = message ? escapeHtml(String(message)) : "—";

    let subject: string;
    let html: string;

    if (type === "pickup") {
      const safePickupTime = escapeHtml(preferred_pickup);
      subject = `New Pickup Request: ${escapeHtml(name)}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">New Pickup Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Pickup Address</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeAddress}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Preferred Pickup Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePickupTime}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeMessage}</td></tr>
          </table>
        </div>
      `;
    } else {
      subject = `New Donation: ${escapeHtml(name)} (${book_quantity} books)`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">New Book Donation Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Pickup Address</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeAddress}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Book Quantity</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${book_quantity}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Book Condition</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${conditionLabels[book_condition] ?? book_condition}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeMessage}</td></tr>
          </table>
        </div>
      `;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `HealingPages <${GMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
    });

    return jsonResponse({ success: true, id: info.messageId }, 200);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
