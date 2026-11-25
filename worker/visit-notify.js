/**
 * Visit-notify Worker.
 *
 * Receives a small beacon from the site when someone opens it, and sends a
 * Telegram message to you. The bot token stays here as a secret, so it is
 * never exposed in the website's source.
 *
 * Secrets / vars (set with `wrangler secret put` or in the dashboard):
 *   TELEGRAM_BOT_TOKEN  – from @BotFather
 *   TELEGRAM_CHAT_ID    – your own chat id (from @userinfobot)
 *   ALLOW_ORIGIN        – your site's origin, e.g. https://example.com (or * )
 */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("Not found", { status: 404, headers: cors });

    // The beacon is sent as text/plain to avoid a CORS preflight.
    let body = {};
    try {
      body = JSON.parse(await request.text());
    } catch {
      body = {};
    }

    const clip = (v, n) => String(v ?? "?").slice(0, n);
    const cf = request.cf || {};
    const ip = request.headers.get("CF-Connecting-IP") || "?";
    const ua = request.headers.get("User-Agent") || "?";
    const place = [cf.city, cf.region, cf.country].filter(Boolean).join(", ") || "unknown";

    const text =
      "👀 Someone opened your site\n" +
      `• Time (UTC): ${new Date().toISOString().replace("T", " ").slice(0, 19)}\n` +
      `• Page: ${clip(body.path, 200)}\n` +
      `• From: ${clip(body.referrer, 200)}\n` +
      `• Location: ${place}\n` +
      `• IP: ${ip}\n` +
      `• Device: ${clip(body.timezone, 60)} · ${clip(body.language, 30)} · ${clip(body.screen, 20)}\n` +
      `• Browser: ${clip(ua, 300)}`;

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            disable_web_page_preview: true,
          }),
        });
      } catch {
        // Swallow errors: a failed notification must not surface to the visitor.
      }
    }

    return new Response(null, { status: 204, headers: cors });
  },
};
