import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      return jsonResponse({ error: "Missing RESEND_API_KEY or NOTIFICATION_EMAIL" }, 500);
    }

    const { name, email, phone, pickup_address, book_quantity, book_condition, message } = await req.json();

    // Input validation
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof pickup_address !== "string" || !pickup_address.trim()
    ) {
      return jsonResponse({ error: "name, email, phone, and pickup_address are required strings" }, 400);
    }
    if (!Number.isInteger(book_quantity) || book_quantity < 1) {
      return jsonResponse({ error: "book_quantity must be a positive integer" }, 400);
    }
    if (!Number.isInteger(book_condition) || book_condition < 1 || book_condition > 5) {
      return jsonResponse({ error: "book_condition must be an integer from 1 to 5" }, 400);
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

    const html = `
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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "HealingPages <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: `New Donation: ${escapeHtml(name)} (${book_quantity} books)`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return jsonResponse({ error: data }, res.status);
    }

    return jsonResponse({ success: true, id: data.id }, 200);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
