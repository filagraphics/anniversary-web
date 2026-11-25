/**
 * Visit-notify Worker.
 *
 * Receives a small beacon from the site when someone opens it, and sends a
 * nicely formatted Telegram message to you. The bot token stays here as a
 * secret, so it is never exposed in the website's source.
 *
 * Secrets / vars (set with `wrangler secret put` or in the dashboard):
 *   TELEGRAM_BOT_TOKEN  – from @BotFather
 *   TELEGRAM_CHAT_ID    – your chat / channel id (channel: -100…, or @name)
 *   ALLOW_ORIGIN        – your site's origin, e.g. https://example.com (or * )
 *   OWNER_TZ            – optional, your time zone (default Africa/Addis_Ababa)
 */

/** Escape the five characters that matter for Telegram HTML parse_mode. */
function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Turn a 2-letter country code (ET) into its flag emoji (🇪🇹). */
function flag(cc) {
  if (!cc || cc.length !== 2 || !/^[A-Za-z]{2}$/.test(cc)) return "";
  const base = 0x1f1e6;
  return String.fromCodePoint(base + (cc.toUpperCase().charCodeAt(0) - 65), base + (cc.toUpperCase().charCodeAt(1) - 65));
}

/** A short, human device summary from the user-agent string. */
function device(ua = "") {
  const os =
    /iPhone|iPad|iPod/.test(ua) ? "iPhone/iPad" :
    /Android/.test(ua) ? "Android" :
    /Mac OS X/.test(ua) ? "Mac" :
    /Windows/.test(ua) ? "Windows" :
    /Linux/.test(ua) ? "Linux" : "";
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) ? "Safari" : "";
  return [os, browser].filter(Boolean).join(" · ") || "unknown";
}

/** Your local time, formatted, e.g. "Nov 25, 2026, 9:48 PM". */
function localTime(tz) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
  } catch {
    return new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  }
}

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

    const clip = (v, n) => String(v ?? "").slice(0, n);
    const cf = request.cf || {};
    const ip = request.headers.get("CF-Connecting-IP") || "?";
    const ua = request.headers.get("User-Agent") || "";
    const tz = env.OWNER_TZ || "Africa/Addis_Ababa";
    const tzLabel = env.OWNER_TZ_LABEL || "EAT";

    // Drop a region that just repeats the city, e.g. "Addis Ababa, Addis Ababa".
    const place = [...new Set([cf.city, cf.region].filter(Boolean))].join(", ");
    const cc = cf.country || "";
    const location = [flag(cc), place, place ? "" : cc].filter(Boolean).join(" ") || "unknown";

    // Referrer: a clickable link when it's a URL, otherwise "Direct / typed in".
    const ref = clip(body.referrer, 300);
    let from = "Direct / typed in";
    if (ref && ref !== "direct") {
      try {
        const u = new URL(ref);
        from = `<a href="${esc(ref)}">${esc(u.hostname)}</a>`;
      } catch {
        from = esc(ref);
      }
    }

    const lines = [
      "🔔 <b>Someone opened your memory book</b>",
      "",
      `🕰 <b>Time:</b> ${esc(localTime(tz))} ${esc(tzLabel)}`,
      `📖 <b>Page:</b> <code>${esc(clip(body.path, 200) || "/")}</code>`,
      `↩️ <b>Came from:</b> ${from}`,
      `📍 <b>Location:</b> ${esc(location)}`,
      `📱 <b>Device:</b> ${esc(device(ua))}`,
      `🖥 <b>Screen:</b> ${esc(clip(body.screen, 20) || "?")} · ${esc(clip(body.language, 20) || "?")}`,
      `🌐 <b>Visitor TZ:</b> ${esc(clip(body.timezone, 60) || "?")}`,
      `🧭 <b>IP:</b> <code>${esc(ip)}</code>`,
    ];
    const text = lines.join("\n");

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: "HTML",
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
