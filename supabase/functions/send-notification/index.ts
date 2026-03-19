import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY or NOTIFICATION_EMAIL" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const { name, email, phone, pickup_address, book_quantity, book_condition, message } = await req.json();

    const conditionLabels: Record<number, string> = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Like New",
    };

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">New Book Donation Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Pickup Address</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${pickup_address}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Book Quantity</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${book_quantity}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Book Condition</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${conditionLabels[book_condition] ?? book_condition}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message ?? "—"}</td></tr>
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
        subject: `New Donation: ${name} (${book_quantity} books)`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
